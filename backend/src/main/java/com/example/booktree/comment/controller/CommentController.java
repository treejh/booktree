package com.example.booktree.comment.controller;

import com.example.booktree.comment.dto.CommentDto;
import com.example.booktree.comment.service.CommentService;
import com.example.booktree.like_comment.dto.LikeCommentDto;
import com.example.booktree.like_comment.service.LikeCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final LikeCommentService likeCommentService;

    // 댓글 생성
    @PostMapping("/create")
    public ResponseEntity<CommentDto.Response> createComment(
            @RequestBody @Valid CommentDto.Post postDto) {
        CommentDto.Response created = commentService.createComment(postDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 댓글 조회: /api/v1/comments/get?postId=1&page=1&size=10
    @GetMapping("/get")
    public ResponseEntity<Page<CommentDto.Response>> getComments(
            @RequestParam("postId") Long postId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<CommentDto.Response> response = commentService.getCommentsByPostId(postId, pageRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 댓글 수정
    @PatchMapping("/update/{commentId}")
    public ResponseEntity<CommentDto.Response> updateComment(@PathVariable Long commentId,
                                                             @RequestBody CommentDto.Patch dto) {
        dto.setCommentId(commentId);
        CommentDto.Response response = commentService.updateComment(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 댓글 삭제
    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /** 댓글 좋아요 토글 */
    @PostMapping("/{commentId}/like")
    public ResponseEntity<Map<String, Long>> toggleLike(@PathVariable Long commentId) {
        // likeCommentService.toggleLike를 직접 호출하거나, commentService에 위임해도 됩니다.
        // 여기서는 LikeCommentService를 직접 사용한다고 가정:
        LikeCommentDto.Response dto = likeCommentService.toggleLike(
                new LikeCommentDto.Post(commentId)
        );
        // 반환값으로 최신 likeCount만 보내도록 맵핑
        Map<String, Long> body = Collections.singletonMap("likeCount",
                commentService.getLikeCount(commentId));
        return ResponseEntity.ok(body);
    }
}