package com.example.booktree.likecomment.service;

import com.example.booktree.likecomment.dto.LikeCommentDto;
import com.example.booktree.likecomment.entity.LikeComment;
import com.example.booktree.likecomment.repository.LikeCommentRepository;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeCommentService {

    private final LikeCommentRepository likeCommentRepository;
    private final CommentRepository commentRepository;
    private final TokenService tokenService;
    private final UserService userService;

    /**
     * 댓글 좋아요 토글
     * - 요청 시 해당 댓글에 대해 현재 로그인한 사용자가 좋아요를 이미 누른 상태이면 좋아요를 삭제(취소)하고, 그렇지 않으면 좋아요를 생성
     *   좋아요 생성 시에는 생성된 좋아요 정보를,
     *   좋아요가 취소된 경우에는 likeCommentId가 0인 응답을 반환
     */
    @Transactional
    public LikeCommentDto.Response toggleLike(LikeCommentDto.Post dto) {
        // 댓글 존재 여부 확인
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));

        // 토큰에서 현재 사용자 아이디 추출 후 User 조회
        Long userId = tokenService.getIdFromToken();
        User user = userService.findById(userId);

        // 기존 좋아요 여부 체크
        Optional<LikeComment> existingLike = likeCommentRepository.findByComment_IdAndUser_Id(dto.getCommentId(), user.getId());
        if (existingLike.isPresent()) {
            // 이미 좋아요한 상태이면 삭제(취소)
            likeCommentRepository.delete(existingLike.get());
            // 좋아요 취소 상태를 나타내기 위해 likeCommentId를 0으로 반환
            return new LikeCommentDto.Response(0L, comment.getId(), user.getId());
        } else {
            // 좋아요 생성
            LikeComment likeComment = LikeComment.builder()
                    .comment(comment)
                    .user(user)
                    .build();
            LikeComment saved = likeCommentRepository.save(likeComment);
            return new LikeCommentDto.Response(saved.getId(), comment.getId(), user.getId());
        }
    }
}
