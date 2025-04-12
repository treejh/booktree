package com.example.booktree.reply.service;

import com.example.booktree.reply.dto.ReplyDto;
import com.example.booktree.reply.entity.Reply;
import com.example.booktree.reply.repository.ReplyRepository;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.TokenService;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final CommentRepository commentRepository;
    private final TokenService tokenService;
    private final UserService userService;

    @Transactional
    public ReplyDto.Response createReply(ReplyDto.Post dto) {
        // 부모 댓글 조회
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));
        // 토큰에서 현재 로그인한 사용자의 이메일을 추출하고, 해당 사용자 조회
        String userEmail = tokenService.getEmailFromToken();
        User user = userService.findByUserEmail(userEmail);

        Reply reply = Reply.builder()
                .content(dto.getContent())
                .comment(comment)
                .user(user)   // JWT를 통해 결정한 작성자 정보
                .build();

        Reply saved = replyRepository.save(reply);
        return mapToResponse(saved);
    }

    // 특정 부모 댓글에 달린 대댓글 목록 조회
    public List<ReplyDto.Response> getRepliesByCommentId(Long commentId) {
        List<Reply> replies = replyRepository.findByComment_Id(commentId);
        return replies.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // 작성자만 수정 가능, 대댓글 수정
    @Transactional
    public ReplyDto.Response updateReply(ReplyDto.Patch dto) {
        Reply reply = replyRepository.findById(dto.getReplyId())
                .orElseThrow(() -> new RuntimeException("Reply not found with id: " + dto.getReplyId()));
        // 현재 로그인한 사용자 ID 가져오기
        Long currentUserId = tokenService.getIdFromToken();
        // 작성자 검증: 수정 요청한 사용자가 실제 작성자인지 확인
        if (!reply.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("You are not authorized to update this reply");
        }
        reply.setContent(dto.getContent());
        Reply updated = replyRepository.save(reply);
        return mapToResponse(updated);
    }
    
    // 작성자만 대댓글 삭제
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

    // Reply 엔티티를 ReplyDto.Response DTO로 변환
    private ReplyDto.Response mapToResponse(Reply reply) {
        Long commentId = Optional.ofNullable(reply.getComment())
                .map(Comment::getId)
                .orElse(null);
        String userEmail = reply.getUser() != null ? reply.getUser().getEmail() : null;
        return new ReplyDto.Response(
                reply.getId(),
                commentId,
                reply.getContent(),
                reply.getCreatedAt(),
                reply.getModifiedAt(),
                userEmail
        );
    }
}
