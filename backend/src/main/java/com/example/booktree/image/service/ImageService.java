package com.example.booktree.image.service;


import com.example.booktree.image.entity.Image;
import com.example.booktree.image.repository.ImageRepository;
import com.example.booktree.utils.S3Uploader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final S3Uploader s3Uploader;


    public List<String> saveImages(List<MultipartFile> multipartFiles){
        List<String> imagePathList = new ArrayList<>();
        multipartFiles.forEach(image->{
            try {
                String imagePath= s3Uploader.uploadFile(image);
                Image saveImage = Image.builder()
                                .imageUrl(imagePath)
                                .createdAt(LocalDateTime.now())
                                .modifiedAt(LocalDateTime.now())
                                .build();
                imageRepository.save(saveImage);
                imagePathList.add(imagePath);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });


        return imagePathList;
    }
}
