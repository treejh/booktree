package com.example.booktree.reply.service;

import com.example.booktree.reply.dto.ReplyDto;
import com.example.booktree.reply.entity.Reply;
import com.example.booktree.reply.repository.ReplyRepository;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    // 대댓글 생성
    @Transactional
    public ReplyDto.Response createReply(ReplyDto.Post dto) {
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));

        Reply reply = Reply.builder()
                .content(dto.getContent())
                .comment(comment)
                .user(user)
                .build();

        Reply saved = replyRepository.save(reply);
        return mapToResponse(saved);
    }

    // 특정 댓글에 달린 대댓글 목록을 조회
    public List<ReplyDto.Response> getRepliesByCommentId(Long commentId) {
        List<Reply> replies = replyRepository.findByComment_Id(commentId);
        return replies.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 대댓글 수정
    @Transactional
    public ReplyDto.Response updateReply(ReplyDto.Patch dto) {
        Reply reply = replyRepository.findById(dto.getReplyId())
                .orElseThrow(() -> new RuntimeException("Reply not found with id: " + dto.getReplyId()));
        reply.setContent(dto.getContent());
        Reply updated = replyRepository.save(reply);
        return mapToResponse(updated);
    }

    // 대댓글 삭제
    @Transactional
    public void deleteReply(Long replyId) {
        replyRepository.deleteById(replyId);
    }

    // Reply 엔티티를 ReplyDto.Response로 매핑하는 헬퍼 메서드
    private ReplyDto.Response mapToResponse(Reply reply) {
        return new ReplyDto.Response(
                reply.getId(),
                reply.getComment() != null ? reply.getComment().getId() : null,
                reply.getUser() != null ? reply.getUser().getId() : null,
                reply.getContent(),
                reply.getCreatedAt(),
                reply.getModifiedAt()
        );
    }
}
