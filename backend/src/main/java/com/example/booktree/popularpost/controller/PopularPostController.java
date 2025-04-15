package com.example.booktree.popularpost.controller;

import com.example.booktree.post.dto.response.PostResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.popularpost.service.PopularPostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/popular")
@Slf4j
public class PopularPostController {

    private final PopularPostService popularPostService;

    // 실시간 인기 게시글 목록 가져오기
    @GetMapping("/get/posts")
    public ResponseEntity<List<PostResponseDto>> getPopularPosts(
            @RequestParam(defaultValue = "10") int limit) {

        List<Post> popularPosts = popularPostService.getPopularPosts(limit);
        List<PostResponseDto> result = popularPosts.stream()
                .map(post -> PostResponseDto.builder()
                        .postId(post.getId())
                        .title(post.getTitle())
                        .createdAt(post.getCreatedAt())
                        .modifiedAt(post.getModifiedAt())
                        .viewCount(post.getView())
                        .build())
                .toList();

        return ResponseEntity.ok(result);
    }
}
