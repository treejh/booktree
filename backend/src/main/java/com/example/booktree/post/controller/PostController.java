package com.example.booktree.post.controller;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.post.dto.request.PostRequestDto;
import com.example.booktree.post.dto.response.PostResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
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


    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createPost(@ModelAttribute @Valid PostRequestDto dto) {
        postService.createPost(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("게시글 등록 성공!");
    }

    @PatchMapping(value = "/patch/{postId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updatePost(@PathVariable("postId") Long postId,
                                        @ModelAttribute @Valid PostRequestDto postRequestDto) {
        postService.updatePost(postId, postRequestDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable("postId") Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }



    // 게시글 아이디로 해당 게시글 조회
    @GetMapping("/get/{postId}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable("postId") Long postId) {
        Post post = postService.findPostById(postId);
        PostResponseDto response = PostResponseDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .viewCount(post.getView())
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 블로그별로 게시글 목록 조회
    @GetMapping("/get/blog/{blogId}")
    public ResponseEntity<List<PostResponseDto>> getPostsByBlog(@PathVariable("blogId") Long blogId) {
        List<PostResponseDto> posts = postService.getPostsByBlog(blogId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // 회원별로 게시글 목록 조회
    @GetMapping("/get/user/{userId}")
    public ResponseEntity<List<PostResponseDto>> getPostsByUser(@PathVariable("userId") Long userId) {
        List<PostResponseDto> posts = postService.getPostsByUser(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }




}
