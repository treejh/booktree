package com.example.booktree.blog.controller;


import com.example.booktree.blog.dto.request.BlogRequestDto;
import com.example.booktree.blog.dto.response.BlogResponseDto;
import com.example.booktree.blog.service.BlogService;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/blogs")
@Validated
@AllArgsConstructor
public class BlogController {

    private final BlogService blogService;

    // Create
    @PostMapping("/create")
    public ResponseEntity postBlog(@Valid @RequestBody BlogRequestDto blogRequestDto) {
        BlogResponseDto response = new BlogResponseDto(blogService.createBlog(blogRequestDto));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Read
    //내 블로그는 하나밖에 없다는 가정하에 유저 아이디로 가져옴//
    @GetMapping("/get")
    public ResponseEntity getBlogByUserId(@Positive @RequestParam Long blogId) {
        BlogResponseDto response = new BlogResponseDto(blogService.findBlogByBlogId(blogId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Read
    //내 블로그는 하나밖에 없다는 가정하에 토큰으로 가져옴
    @GetMapping("/get/token")
    public ResponseEntity getBlogByToken() {
        BlogResponseDto response = new BlogResponseDto(blogService.findBlogByToken());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    // Update
    @PatchMapping("/patch")
    public ResponseEntity patchBlog(@RequestBody BlogRequestDto blogRequestDto) {
        BlogResponseDto response = new BlogResponseDto(blogService.updateBlog(blogRequestDto));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Delete
    @DeleteMapping("/delete")
    public ResponseEntity deleteBlog() {
        blogService.deleteBlog();
        return new ResponseEntity<>("삭제 완료",HttpStatus.OK);
    }

    @GetMapping("/get/findUserId/{blogId}")
    public ResponseEntity<?> findUserIdByBlogId(@PathVariable Long blogId) {
        Long response = blogService.findUserIdByBlogId(blogId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get/username/{username}")
    public ResponseEntity<Long> getBlogIdByUsername(@PathVariable(name = "username") String username) {
        try {
            Long blogId = blogService.findBlogIdByUsername(username);
            return ResponseEntity.ok(blogId);
        } catch (BusinessLogicException e) {
            if (e.getExceptionCode() == ExceptionCode.USER_NOT_FOUND) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .build();
            } else if (e.getExceptionCode() == ExceptionCode.BLOG_NOT_FOUND) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/get/info")
    public ResponseEntity<BlogResponseDto> getBlogInfo(@RequestParam(name = "blogId") Long blogId) {
        BlogResponseDto blogResponse = blogService.getBlogInfo(blogId);
        return ResponseEntity.ok(blogResponse);
    }



}