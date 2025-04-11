package com.example.booktree.post.controller;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.post.dto.response.PostResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;


    // 카테고리 별 최신순 글 가지고 오기
    @GetMapping("/get/maincategory/{maincategoryId}/{value}")
    public ResponseEntity<?> getPostByMaincCategory(@PathVariable Long maincategoryId,
                                                    @RequestParam(name = "page", defaultValue = "1") int page,
                                                    @RequestParam(name="size", defaultValue = "8") int size,
                                                    @PathVariable int value) {

        String type = "createdAt";
        if(value == 1){
            type = "createdAt";
        }else if(value == 2){
            type = "view";
        }else {
            throw new BusinessLogicException(ExceptionCode.MAINCATEGORY_NOT_FOUNT);
        }
        // 추천 순

        Page<Post> postPage = postService.getPost(PageRequest.of(page -1, size, Sort.by(Sort.Direction.DESC, type)), maincategoryId);
        Page<PostResponseDto> response = postPage.map(post -> PostResponseDto.builder()
                        .title(post.getTitle())
                        .createdAt(post.getCreatedAt())
                        .modifiedAt(post.getModifiedAt())
                        .postId(post.getId())
                        .viewCount(post.getView())
                        .build()
                );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 카테고리 별 조회수순으로 글 가지고 오기
    @GetMapping("/get/maincategory/{maincategoryId}/view")
    public ResponseEntity<?> getPostByViews(@PathVariable Long maincategoryId,
                                                    @RequestParam(name = "page", defaultValue = "1") int page,
                                                    @RequestParam(name="size", defaultValue = "6") int size
                                                    ) {
        // 추천 순
        Page<Post> postPage = postService.getPostByViews(PageRequest.of(page -1, size), maincategoryId);

        Page<PostResponseDto> response = postPage.map(post -> PostResponseDto.builder()
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .postId(post.getId())
                .viewCount(post.getView())
                .build()
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
