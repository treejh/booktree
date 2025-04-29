package com.example.booktree.likepost.controller;


import com.example.booktree.likepost.dto.LikeUserListDto;
import com.example.booktree.likepost.dto.response.LikePostResponseDto;
import com.example.booktree.likepost.service.LikePostService;
import com.example.booktree.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/likeposts")
@RequiredArgsConstructor
public class LikePostController {


    private final LikePostService likePostService;


    @PostMapping("/click/{postId}")
    public ResponseEntity<LikePostResponseDto> toggleLike(@PathVariable("postId") Long postId) {
        //Long postId = requestDto.getPostId();
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


     //좋아요 개수 조회

    @GetMapping("/get/{postId}/count")
    public ResponseEntity<LikePostResponseDto> getLikeCount(@PathVariable("postId") Long postId) {
        int likeCount = likePostService.getLikeCount(postId);
        boolean hasLiked = likePostService.hasLikedPost(postId);

        LikePostResponseDto responseDto = new LikePostResponseDto(
                postId,
                (long) likeCount,
                hasLiked
        );

        return ResponseEntity.ok(responseDto);
    }



     // 좋아요를 누른 유저들의 목록 조회



    @GetMapping("/get/{postId}/users")
    public ResponseEntity<List<LikeUserListDto>> getUsersWhoLikedPost(@PathVariable("postId") Long postId) {
        List<User> users = likePostService.getUsersWhoLikedPost(postId);
        List<LikeUserListDto> userDtos = users.stream()
                .map(user -> new LikeUserListDto(user))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }




}
