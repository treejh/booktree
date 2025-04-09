package com.example.booktree.image.controller;

import com.example.booktree.image.service.ImageService;
import com.example.booktree.utils.S3Uploader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
public class ImageController {
 
    private final ImageService imageService;

    @PostMapping
    public ResponseEntity<List<String>> uploadFile(List<MultipartFile> multipartFiles){

    }
 
    @DeleteMapping
    public ResponseEntity<String> deleteFile(@RequestParam String fileName){
        s3Uploader.deleteFile(fileName);
        return ResponseEntity.ok(fileName);
    }
}