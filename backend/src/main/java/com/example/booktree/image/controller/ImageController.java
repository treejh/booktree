package com.example.booktree.image.controller;

import com.example.booktree.image.service.ImageService;
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
@RequestMapping("/api/image")
public class ImageController {
 
    private final ImageService imageService;


    @PostMapping
    public ResponseEntity<List<String>> uploadFile(List<MultipartFile> multipartFiles){
        List<String> imageNameList = new ArrayList<>();
        multipartFiles.forEach(image->{
            try {
                imageNameList.add(imageService.uploadFile(image));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
         return ResponseEntity.ok(imageNameList);
    }
 
    @DeleteMapping
    public ResponseEntity<String> deleteFile(@RequestParam String fileName){
        imageService.deleteFile(fileName);
        return ResponseEntity.ok(fileName);
    }
}