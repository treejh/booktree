package com.example.booktree.comment.controller;

import com.example.booktree.comment.dto.CommentDto;
import com.example.booktree.comment.service.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@AllArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 생성
    @PostMapping("/create")
    public ResponseEntity<CommentDto.Response> createComment(@RequestBody CommentDto.Post dto) {
        CommentDto.Response response = commentService.createComment(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 댓글 조회: /api/v1/comments/get?postId={postId}
    @GetMapping("/get")
    public ResponseEntity<List<CommentDto.Response>> getComments(@RequestParam("postId") Long postId) {
        List<CommentDto.Response> responses = commentService.getCommentsByPostId(postId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
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
}
