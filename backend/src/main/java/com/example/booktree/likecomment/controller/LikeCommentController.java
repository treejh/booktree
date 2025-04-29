package com.example.booktree.likecomment.controller;

import com.example.booktree.likecomment.dto.LikeCommentDto;
import com.example.booktree.likecomment.service.LikeCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/like-comments")
@RequiredArgsConstructor
public class LikeCommentController {

    private final LikeCommentService likeCommentService;

    // 좋아요 : /api/v1/like-comments/create
    @PostMapping("/create")
    public ResponseEntity<LikeCommentDto.Response> toggleLike(@RequestBody LikeCommentDto.Post dto) {
        LikeCommentDto.Response response = likeCommentService.toggleLike(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //  삭제는 토글로 처리하는 방식으로 변경
}
