package com.example.booktree.LikePost.controller;


import com.example.booktree.LikePost.dto.request.LikePostRequestDto;
import com.example.booktree.LikePost.dto.response.LikePostResponseDto;
import com.example.booktree.LikePost.service.LikePostService;
import com.example.booktree.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/likepost")
@RequiredArgsConstructor
public class LikePostController {


    private final LikePostService likePostService;

    /**
     * ❤️ 좋아요 토글 (좋아요/취소)
     * - 이미 좋아요 했으면 취소
     * - 아니면 좋아요 등록
     */
    @PostMapping("/click")
    public ResponseEntity<LikePostResponseDto> toggleLike(@RequestBody LikePostRequestDto requestDto) {
        Long postId = requestDto.getPostId();
        boolean hasLiked = likePostService.hasLikedPost(postId);

        if (hasLiked) {
            likePostService.unlikePost(postId);
        } else {
            likePostService.likePost(postId);
        }

        int likeCount = likePostService.getLikeCount(postId);

        LikePostResponseDto responseDto = new LikePostResponseDto(
                postId,
                (long) likeCount,
                !hasLiked // 현재는 반대로 바뀌었으니까
        );

        return ResponseEntity.ok(responseDto);
    }

    /**
     * 📊 좋아요 개수 조회
     */
    @GetMapping("/{postId}/count")
    public ResponseEntity<LikePostResponseDto> getLikeCount(@PathVariable Long postId) {
        int likeCount = likePostService.getLikeCount(postId);
        boolean hasLiked = likePostService.hasLikedPost(postId);

        LikePostResponseDto responseDto = new LikePostResponseDto(
                postId,
                (long) likeCount,
                hasLiked
        );

        return ResponseEntity.ok(responseDto);
    }


    /**
     * 좋아요를 누른 유저들의 목록 조회
     */
    @GetMapping("/{postId}/users")
    public ResponseEntity<List<User>> getUsersWhoLikedPost(@PathVariable Long postId) {
        List<User> users = likePostService.getUsersWhoLikedPost(postId);
        return ResponseEntity.ok(users);
    }



}
