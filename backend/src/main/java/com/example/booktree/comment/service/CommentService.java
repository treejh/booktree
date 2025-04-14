package com.example.booktree.comment.service;

import com.example.booktree.comment.dto.CommentDto;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import com.example.booktree.reply.dto.ReplyDto;
import com.example.booktree.reply.repository.ReplyRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.TokenService;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final ReplyRepository replyRepository; // 대댓글 조회를 위한 Repository
    private final TokenService tokenService;
    private final UserService userService;

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

        String userEmail = tokenService.getEmailFromToken();
        User user = userService.findByUserEmail(userEmail);

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .post(post)
                .user(user)
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToResponseWithReplies(saved);
    }

    // 페이징 적용된 댓글 조회 메서드 (예: 한 페이지당 10개, 최신순 정렬)
    public Page<CommentDto.Response> getCommentsByPostId(Long postId, PageRequest pageRequest) {
        return commentRepository.findByPostId(postId, pageRequest)
                .map(this::mapToResponseWithReplies);
    }

    // 댓글 수정, 삭제 등은 기존 코드 그대로 유지 (작성자 검증 등 포함)
    @Transactional
    public CommentDto.Response updateComment(CommentDto.Patch dto) {
        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));
        Long currentUserId = tokenService.getIdFromToken();
        if (!comment.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("You are not authorized to update this comment");
        }
        comment.setContent(dto.getContent());
        Comment updated = commentRepository.save(comment);
        return mapToResponseWithReplies(updated);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        Long currentUserId = tokenService.getIdFromToken();
        if (!comment.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }
        commentRepository.deleteById(commentId);
    }

    // 각 댓글에 대해 대댓글(Reply)을 페이징 처리하여 포함하는 헬퍼 메서드
    private CommentDto.Response mapToResponseWithReplies(Comment comment) {
        Long postId = Optional.ofNullable(comment.getPost())
                .map(Post::getId)
                .orElse(null);
        String userEmail = comment.getUser() != null ? comment.getUser().getEmail() : null;
        // 기본적으로 대댓글은 첫 페이지(0번 페이지)에서 10개씩, 최신순(생성일 내림차순)으로 가져옵니다.
        PageRequest replyPageRequest = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        Page<ReplyDto.Response> replies = replyRepository.findByComment_Id(comment.getId(), replyPageRequest)
                .map(reply -> new ReplyDto.Response(
                        reply.getId(),
                        reply.getComment() != null ? reply.getComment().getId() : null,
                        reply.getContent(),
                        reply.getCreatedAt(),
                        reply.getModifiedAt(),
                        reply.getUser() != null ? reply.getUser().getEmail() : null
                ));
        return new CommentDto.Response(
                comment.getId(),
                comment.getContent(),
                postId,
                comment.getCreatedAt(),
                comment.getModifiedAt(),
                userEmail,
                replies
        );
    }

}
