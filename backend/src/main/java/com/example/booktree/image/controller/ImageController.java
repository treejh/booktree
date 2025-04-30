package com.example.booktree.image.controller;

import com.example.booktree.image.dto.request.ImageRequestDto;
import com.example.booktree.image.dto.response.ImageResponseDto;
import com.example.booktree.image.entity.Image;
import com.example.booktree.image.service.ImageService;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
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

    //기본 이미지 파일 업로드
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> uploadFile(@RequestParam("files") List<MultipartFile> multipartFiles) {
        return ResponseEntity.ok(imageService.saveImages(multipartFiles));
    }


    //포스트에 이미지 파일 업로드
    @PostMapping(value="/post",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<Image>> saveImagesToPost(@ModelAttribute ImageRequestDto imageRequestDto) {
        return ResponseEntity.ok(imageService.saveImagesToPost(imageRequestDto));
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

    //이미지 리스트 수정
    @PatchMapping(value = "/post/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity patchImagesRoom(@ModelAttribute ImageRequestDto imageRequestDto) {
        List<Image> updateImageList = imageService.uploadPostImage(imageRequestDto.getPostId(),imageRequestDto.getImages());

        List<ImageResponseDto> response = new ArrayList<>();
        for(Image image : updateImageList){
            response.add(new ImageResponseDto(image.getId(),image.getImageUrl()));
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}