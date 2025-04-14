package com.example.booktree.comment.service;

import com.example.booktree.comment.dto.CommentDto;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final TokenService tokenService;
    private final UserService userService;

    // 댓글 생성: CommentDto.Post DTO를 받아 해당 게시글이 존재하면 댓글을 생성하고, Response DTO를 반환
    @Transactional
    public CommentDto.Response createComment(CommentDto.Post dto) {
        Optional<Post> postOptional = postRepository.findById(dto.getPostId());
        if (!postOptional.isPresent()) {
            throw new RuntimeException("Post not found with id: " + dto.getPostId());
        }
        Post post = postOptional.get();

        // JWT 토큰에서 사용자 이메일을 추출하고, 해당 사용자 정보를 조회합니다.
        String email = tokenService.getEmailFromToken();
        User user = userService.findUserByEmail(email);

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .post(post)
                .user(user)  // 댓글 작성자를 로그인한 사용자로 지정
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    // 특정 게시글(postId)에 속한 모든 댓글을 조회하여 Response DTO 리스트로 반환
    public List<CommentDto.Response> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 댓글 수정: CommentDto.Patch DTO를 받아 댓글 내용을 업데이트한 후 Response DTO를 반환
    // 수정은 해당 댓글 작성자만 할 수 있도록 현재 로그인한 사용자와 비교
    @Transactional
    public CommentDto.Response updateComment(CommentDto.Patch dto) {
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));

        // 현재 로그인한 사용자의 ID를 토큰에서 추출하여 확인
        Long currentUserId = tokenService.getIdFromToken();
        if (!comment.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized: Only the comment author can update this comment");
        }
        comment.setContent(dto.getContent());
        Comment updated = commentRepository.save(comment);
        return mapToResponse(updated);
    }

    // 댓글 삭제: 주어진 commentId에 대해 댓글을 삭제
    // 삭제도 댓글 작성자만 할 수 있도록 확인
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        // 현재 로그인한 사용자와 댓글 작성자 비교
        Long currentUserId = tokenService.getIdFromToken();
        if (!comment.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized: Only the comment author can delete this comment");
        }
        commentRepository.delete(comment);
    }

    // Comment 엔티티를 CommentDto.Response로 매핑하는 헬퍼 메서드.
    // 댓글의 게시글(post) 및 작성자(user) 정보도 함께 반환
    private CommentDto.Response mapToResponse(Comment comment) {
        Long postId = Optional.ofNullable(comment.getPost())
                .map(Post::getId)
                .orElse(null);
        String userEmail = comment.getUser() != null ? comment.getUser().getEmail() : null;
        return new CommentDto.Response(
                comment.getId(),
                comment.getContent(),
                postId,
                comment.getCreatedAt(),
                comment.getModifiedAt(),
                userEmail
        );
    }
}
