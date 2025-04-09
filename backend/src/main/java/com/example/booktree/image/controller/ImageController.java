package com.example.booktree.image.controller;

import com.example.booktree.image.entity.Image;
import com.example.booktree.image.service.ImageService;
import com.example.booktree.utils.S3Uploader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
        return ResponseEntity.ok(imageService.saveImages(multipartFiles));
    }

    //파일 이름으로 삭제
    @DeleteMapping
    public ResponseEntity<String> deleteFileByName(@RequestParam String filePath){
        imageService.deleteFile(filePath);
        return ResponseEntity.ok(filePath);
    }

    //파일 번호로 삭제
    @DeleteMapping("/{imageId}")
    public ResponseEntity<String> deleteFileByFileId(@PathVariable Long imageId){
        String filePath = imageService.getImage(imageId).getImageUrl();
        imageService.deleteFile(filePath);
        return ResponseEntity.ok(filePath);
    }


}