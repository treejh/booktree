package com.example.booktree.popularpost.controller;

import com.example.booktree.post.dto.response.PostResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.popularpost.service.PopularPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/popular")
@Slf4j
@Tag(name = "실시간 인기 게시글 관리 컨트롤러")
public class PopularPostController {

    private final PopularPostService popularPostService;

    // 실시간 인기 게시글 목록 가져오기
    @GetMapping("/get/posts/{mainCategoryId}")
    @Operation(
            summary = "실시간 조회수 높은 게시글 불러오기 기능",
            description = "Redis를 통한 실시간 조회수가 높은 게시글을 불러오는 기능",
            tags = "실시간 인기 게시글 관리 컨트롤러"
    )
    public ResponseEntity<List<PostResponseDto>> getPopularPosts(
            @RequestParam(defaultValue = "10") int limit, @PathVariable Long mainCategoryId) {

        log.info("뭔데 : " + mainCategoryId);
        List<PostResponseDto> result = popularPostService.getPopularPosts(limit, mainCategoryId);

        return ResponseEntity.ok(result);
    }


}
