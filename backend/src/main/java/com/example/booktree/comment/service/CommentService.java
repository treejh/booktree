package com.example.booktree.comment.service;

import com.example.booktree.comment.dto.CommentDto;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    // 댓글 생성
    @Transactional
    public CommentDto.Response createComment(CommentDto.Post dto) {
        Optional<Post> postOptional = postRepository.findById(dto.getPostId());
        if (!postOptional.isPresent()) {
            throw new RuntimeException("Post not found with id: " + dto.getPostId());
        }
        Post post = postOptional.get();

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .post(post)
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    // 게시글의 댓글 목록 조회
    public List<CommentDto.Response> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // 댓글 수정
    @Transactional
    public CommentDto.Response updateComment(CommentDto.Patch dto) {
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));
        comment.setContent(dto.getContent());
        Comment updated = commentRepository.save(comment);
        return mapToResponse(updated);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    // Comment 엔티티를 Response DTO로 변환하는 헬퍼 메서드
    private CommentDto.Response mapToResponse(Comment comment) {
        Long postId = Optional.ofNullable(comment.getPost())
                .map(Post::getId)
                .orElse(null);
        return new CommentDto.Response(
                comment.getId(),
                comment.getContent(),
                postId,
                comment.getCreatedAt(),
                comment.getModifiedAt()
        );
    }

}
