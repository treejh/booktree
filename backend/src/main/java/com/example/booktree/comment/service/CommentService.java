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
    // 추가된 의존성: 현재 로그인한 유저 정보를 조회하기 위한 서비스들
    private final TokenService tokenService;
    private final UserService userService;

    @Transactional
    public CommentDto.Response createComment(CommentDto.Post dto) {
        Optional<Post> postOptional = postRepository.findById(dto.getPostId());
        if (!postOptional.isPresent()) {
            throw new RuntimeException("Post not found with id: " + dto.getPostId());
        }
        Post post = postOptional.get();

        // 토큰에서 유저 이메일을 추출하여, 해당 이메일로 User 객체를 조회합니다.
        String userEmail = tokenService.getEmailFromToken();
        User user = userService.findByUserEmail(userEmail);

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .post(post)
                .user(user)   // 댓글 작성자를 User 객체로 설정
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    public List<CommentDto.Response> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto.Response updateComment(CommentDto.Patch dto) {
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));
        comment.setContent(dto.getContent());
        Comment updated = commentRepository.save(comment);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    // Comment 엔티티를 CommentDto.Response로 매핑하는 헬퍼 메서드
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
