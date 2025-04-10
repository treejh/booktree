package com.example.booktree.like_comment.controller;

import com.example.booktree.like_comment.dto.LikeCommentDto;
import com.example.booktree.like_comment.service.LikeCommentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/like-comments")
@AllArgsConstructor
public class LikeCommentController {

    private final LikeCommentService likeCommentService;

    // 댓글 좋아요 생성 엔드포인트
    @PostMapping
    public ResponseEntity<LikeCommentDto.Response> createLike(@RequestBody LikeCommentDto.Post dto) {
        LikeCommentDto.Response response = likeCommentService.createLike(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 댓글 좋아요 삭제 엔드포인트
    @DeleteMapping
    public ResponseEntity<Void> deleteLike(@RequestParam Long commentId,
                                           @RequestParam Long userId) {
        likeCommentService.deleteLike(commentId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
