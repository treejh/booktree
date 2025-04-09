//package com.example.booktree.blog.controller;
//
//
//import com.example.booktree.blog.service.BlogService;
//import jakarta.validation.Valid;
//import jakarta.validation.constraints.Positive;
//import lombok.AllArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.annotation.*;
//
//
//@RestController
//@RequestMapping("/board")
//@Validated
//@AllArgsConstructor
//public class BlogController {
//
//    private final BlogService blogService;
//
//    // Create
//    @PostMapping
//    public ResponseEntity postMember(@Valid @RequestBody BlogDto.Post post) {
//
//        //return new ResponseEntity<>(response, HttpStatus.CREATED);
//    }
//
//    // Read
//    @GetMapping
//    public ResponseEntity getMember(@Positive @RequestParam long memberId) {
//
//        //return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    // Update
//    @PatchMapping
//    public ResponseEntity patchMember(@RequestBody BlogDto.Patch patch) {
//
//        //return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    // Delete
//    @DeleteMapping
//    public ResponseEntity deleteBlog(@Positive @RequestParam long ProjectId) {
//        //return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }
//}