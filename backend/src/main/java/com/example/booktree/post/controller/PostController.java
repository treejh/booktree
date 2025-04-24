package com.example.booktree.post.controller;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.popularpost.service.PopularPostService;
import com.example.booktree.post.dto.request.PostRequestDto;

import com.example.booktree.post.dto.response.PostDetailResponseDto;
import com.example.booktree.post.dto.response.PostFollowingPageDto;


import com.example.booktree.post.dto.response.PostDetailResponseDto;
import com.example.booktree.post.dto.response.PostFollowingPageDto;

import com.example.booktree.post.dto.response.PostResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.service.PostService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;
    private final PopularPostService popularPostService;
    private final String defaultImageUrl = "https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png";

    // 카테고리 별 최신순 글 가지고 오기
    @GetMapping("/get/maincategory/{maincategoryId}/{value}")
    public ResponseEntity<?> getPostByMainCategory(@PathVariable Long maincategoryId,
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
                        .imageUrl(post.getImageList().isEmpty() ? defaultImageUrl : post.getImageList().get(0).getImageUrl())
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
                                                    @RequestParam(name="size", defaultValue = "5") int size
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

//    @GetMapping("/get/likePost/{postId}")
//    public ResponseEntity<?> getLikePost(@PathVariable("postId") Long postId) {
//        postService.deletePost(postId);
//        return ResponseEntity.noContent().build();
//    }



    // 게시글 아이디로 해당 게시글 조회
    @GetMapping("/get/{postId}")
    public ResponseEntity<PostDetailResponseDto> getPostById(@PathVariable("postId") Long postId) {
        Post post = postService.findPostById(postId);

        // 조회수 업데이트
        popularPostService.increasePopularity(postId, post.getMainCategory().getId());


        PostDetailResponseDto response = PostDetailResponseDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .username(post.getUser().getUsername()) // 작성자 이름
                .imageUrls(post.getImageList().stream()
                        .map(image -> image.getImageUrl()) // 이미지 엔티티에서 URL 꺼내기
                        .toList())
                .viewCount(post.getView()) // 업데이트된 조회수
                .likeCount(post.getLikeCount())
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .build();

        return ResponseEntity.ok(response);
    }


    @GetMapping("/get/blog/{blogId}")
    public ResponseEntity<Page<PostResponseDto>> getPostsByBlog(@PathVariable("blogId") Long blogId,
                                                                @RequestParam(name = "page", defaultValue = "0") int page,
                                                                @RequestParam(name = "size", defaultValue = "8") int size) {

        Page<PostResponseDto> posts = postService.getPagedPostsByBlog(blogId, page, size);
        return ResponseEntity.ok(posts);
    }

    // 회원별로 게시글 목록 조회
    @GetMapping("/get/user/{userId}")
    public ResponseEntity<List<PostResponseDto>> getPostsByUser(@PathVariable("userId") Long userId) {
        List<PostResponseDto> posts = postService.getPostsByUser(userId);


        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/get/blog/popular/{blogId}")
    public ResponseEntity<Page<PostResponseDto>> getPopularPostsByBlog(
            @PathVariable("blogId") Long blogId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "8") int size) {

        Page<PostResponseDto> posts = postService.getPopularPostsByBlog(blogId, page, size);
        return ResponseEntity.ok(posts);
    }




    // 게시글 검색 : /api/v1/posts/search?type=title&keyword=Java&page=1&size=10
    @GetMapping("/search")
    public ResponseEntity<Page<PostResponseDto>> searchPosts(
            @RequestParam("type") String type,
            @RequestParam("keyword") String keyword,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        // 최신순
        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Post> postPage = postService.searchPosts(type, keyword, pageRequest);

        Page<PostResponseDto> dtoPage = postPage.map(post -> PostResponseDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .viewCount(post.getView())
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .build());

        return new ResponseEntity<>(dtoPage, HttpStatus.OK);
    }

    /**
     * 전체 검색 (제목, 내용, 작성자, 책 기준 모두 포함)
     * 호출 URL: GET /api/v1/posts/search/all?keyword=검색어
     */
    @GetMapping("/search/all")
    public ResponseEntity<Page<PostResponseDto>> searchAll(
            @RequestParam("q") String q,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<PostResponseDto> dtos = postService.searchAll(q, pageable)
                .map(post -> PostResponseDto.builder()
                        .postId(post.getId())
                        .title(post.getTitle())
                        .viewCount(post.getView())
                        .createdAt(post.getCreatedAt())
                        .modifiedAt(post.getModifiedAt())
                        .build()
                );
        return ResponseEntity.ok(dtos);
    }



    @GetMapping("/get/followingPost")
    public ResponseEntity<?> getFollowingPost( @RequestParam(name = "page", defaultValue = "1") int page,
                                               @RequestParam(name="size", defaultValue = "8") int size
    ){
        Page<Post> listPost = postService.getPostsFromFollowing(PageRequest.of(page -1, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        Page<PostFollowingPageDto> response = listPost.map(PostFollowingPageDto::new);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get/likePost")
    public ResponseEntity<?> getLikedPosts(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name="size", defaultValue = "8") int size
    ) {

        Page<Post> posts = postService.getPostsFromUserLike(PageRequest.of(page -1, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        Page<PostFollowingPageDto> response = posts.map(PostFollowingPageDto::new);

        return new ResponseEntity<>(response,HttpStatus.OK);
    }






}
