package com.example.booktree.blog.controller;


import com.example.booktree.blog.dto.request.BlogRequestDto;
import com.example.booktree.blog.dto.response.BlogResponseDto;
import com.example.booktree.blog.service.BlogService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/blogs")
@Validated
@AllArgsConstructor
public class BlogController {

    private final BlogService blogService;

    // Create
    @PostMapping
    public ResponseEntity postBlog(@Valid @RequestBody BlogRequestDto blogRequestDto) {
        BlogResponseDto response = new BlogResponseDto(blogService.createBlog(blogRequestDto));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Read
    //내 블로그는 하나밖에 없다는 가정하에 유저 아이디로 가져옴
    @GetMapping
    public ResponseEntity getBlogByUserId(@Positive @RequestParam Long blogId) {
        BlogResponseDto response = new BlogResponseDto(blogService.findBlogByBlogId(blogId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    // Update
    @PatchMapping("/{blogId}")
    public ResponseEntity patchBlog(@RequestBody BlogRequestDto blogRequestDto
                                    , @PathVariable("blogId") Long blogId) {
        BlogResponseDto response = new BlogResponseDto(blogService.updateBlog(blogRequestDto,blogId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Delete
    @DeleteMapping("/{blogId}")
    public ResponseEntity deleteBlog(@RequestBody BlogRequestDto blogRequestDto
                                    ,@PathVariable("blogId") Long blogId) {
        blogService.deleteBlog(blogRequestDto,blogId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}