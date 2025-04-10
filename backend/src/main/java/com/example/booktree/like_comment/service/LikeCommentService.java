package com.example.booktree.like_comment.service;

import com.example.booktree.comment.entity.Comment;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.like_comment.dto.LikeCommentDto;
import com.example.booktree.like_comment.entity.LikeComment;
import com.example.booktree.like_comment.repository.LikeCommentRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class LikeCommentService {

    private final LikeCommentRepository likeCommentRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public LikeCommentService(LikeCommentRepository likeCommentRepository,
                              CommentRepository commentRepository,
                              UserRepository userRepository) {
        this.likeCommentRepository = likeCommentRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    // 댓글 좋아요 생성
    @Transactional
    public LikeCommentDto.Response createLike(LikeCommentDto.Post dto) {
        // 좋아요가 존재하는지 확인하고, 한 사용자는 한 댓글에 한 번만 가능
        Optional<LikeComment> existing = likeCommentRepository.findByComment_IdAndUser_Id(dto.getCommentId(), dto.getUserId());
        if(existing.isPresent()){
            throw new RuntimeException("이미 좋아요를 누르셨습니다.");
        }

        // 댓글 조회
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다. id: " + dto.getCommentId()));

        // 사용자 조회
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. id: " + dto.getUserId()));

        LikeComment likeComment = LikeComment.builder()
                .comment(comment)
                .user(user)
                .build();

        LikeComment saved = likeCommentRepository.save(likeComment);
        return mapToResponse(saved);
    }

    // 댓글 좋아요 삭제
    @Transactional
    public void deleteLike(Long commentId, Long userId) {
        LikeComment likeComment = likeCommentRepository.findByComment_IdAndUser_Id(commentId, userId)
                .orElseThrow(() -> new RuntimeException("해당 좋아요 기록을 찾을 수 없습니다. comment id: " + commentId + ", user id: " + userId));
        likeCommentRepository.delete(likeComment);
    }

    // 엔티티를 Response DTO로 변환하는 헬퍼 메서드
    private LikeCommentDto.Response mapToResponse(LikeComment likeComment) {
        return new LikeCommentDto.Response(
                likeComment.getId(),
                likeComment.getComment() != null ? likeComment.getComment().getId() : null,
                likeComment.getUser() != null ? likeComment.getUser().getId() : null,
                likeComment.getCreatedAt(),
                likeComment.getModifiedAt()
        );
    }
}
