package com.example.booktree.like_reply.controller;

import com.example.booktree.like_reply.dto.LikeReplyDto;
import com.example.booktree.like_reply.service.LikeReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/like-replies")
@RequiredArgsConstructor
public class LikeReplyController {

    private final LikeReplyService likeReplyService;

    // 대댓글 좋아요 : /api/v1/like-replies/create
    @PostMapping("/create")
    public ResponseEntity<LikeReplyDto.Response> toggleLike(@RequestBody LikeReplyDto.Post dto) {
        LikeReplyDto.Response response = likeReplyService.toggleLike(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //  삭제는 토글로 처리하는 방식으로 변경
}
