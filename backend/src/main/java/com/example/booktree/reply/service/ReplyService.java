package com.example.booktree.reply.service;

import com.example.booktree.reply.dto.ReplyDto;
import com.example.booktree.reply.entity.Reply;
import com.example.booktree.reply.repository.ReplyRepository;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final CommentRepository commentRepository;
    private final TokenService tokenService;
    private final UserService userService;

    /**
     * 대댓글 생성.
     * - 부모 댓글(Comment) ID와 대댓글 내용을 요청 DTO로 받아 생성합니다.
     * - JWT 토큰에서 현재 로그인한 사용자 정보를 가져와 작성자(User)를 설정합니다.
     */
    @Transactional
    public ReplyDto.Response createReply(ReplyDto.Post dto) {
        // 부모 댓글 검증
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));
        // JWT 토큰에서 사용자 ID 추출 후, User 조회
        Long userId = tokenService.getIdFromToken();
        User user = userService.findById(userId);


        // 대댓글 생성
        Reply reply = Reply.builder()
                .content(dto.getContent())
                .comment(comment)
                .user(user)
                .build();
        Reply saved = replyRepository.save(reply);
        return mapToResponse(saved);
    }

    /**
     * 대댓글 조회 (페이징 처리)
     * - 특정 부모 댓글(commentId)에 달린 대댓글들을 Pageable 조건에 맞춰 조회
     */
    public Page<ReplyDto.Response> getRepliesByCommentId(Long commentId, Pageable pageable) {
        return replyRepository.findByComment_Id(commentId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * 대댓글 수정
     * 수정할 대댓글의 ID와 새로운 내용을 담은 Patch DTO를 받고,
     * 현재 로그인한 사용자가 해당 대댓글 작성자인지 검증한 후 수정
     */
    @Transactional
    public ReplyDto.Response updateReply(ReplyDto.Patch dto) {
        Reply reply = replyRepository.findById(dto.getReplyId())
                .orElseThrow(() -> new RuntimeException("Reply not found with id: " + dto.getReplyId()));
        Long currentUserId = tokenService.getIdFromToken();
        if (!reply.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("You are not authorized to update this reply");
        }
        reply.setContent(dto.getContent());
        Reply updated = replyRepository.save(reply);
        return mapToResponse(updated);
    }

    /**
     * 대댓글 삭제
     * 삭제할 대댓글의 ID를 받고, 현재 로그인한 사용자가 해당 대댓글의 작성자인지 검증한 후 삭제
     */
    @Transactional
    public void deleteReply(Long replyId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found with id: " + replyId));
        Long currentUserId = tokenService.getIdFromToken();
        if (!reply.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("You are not authorized to delete this reply");
        }
        replyRepository.delete(reply);
    }

    /**
     * Reply 엔티티를 ReplyDto.Response DTO로 변환하는 헬퍼 메서드.
     * 작성자의 이메일도 포함하여 반환
     */
    private ReplyDto.Response mapToResponse(Reply reply) {
        Long commentId = Optional.ofNullable(reply.getComment())
                .map(Comment::getId)
                .orElse(null);
        String username = reply.getUser() != null ? reply.getUser().getUsername() : null;
        long likeCount = reply.getLikeReplyList() != null
                ? reply.getLikeReplyList().size()
                : 0L;
        return new ReplyDto.Response(
                reply.getId(),
                reply.getUser().getId(),
                commentId,
                reply.getContent(),
                reply.getCreatedAt(),
                reply.getModifiedAt(),
                username,
                likeCount
        );
    }
}
