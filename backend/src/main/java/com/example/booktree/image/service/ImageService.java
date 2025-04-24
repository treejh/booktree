package com.example.booktree.image.service;


import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.image.dto.request.ImageRequestDto;
import com.example.booktree.image.entity.Image;
import com.example.booktree.image.repository.ImageRepository;
import com.example.booktree.post.repository.PostRepository;
import com.example.booktree.post.entity.Post;
import com.example.booktree.utils.S3Uploader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final PostRepository postRepository;
    private final S3Uploader s3Uploader;


    public List<String> saveImages(List<MultipartFile> multipartFiles) {
        List<String> imagePathList = new ArrayList<>();
        multipartFiles.forEach(image -> {
            try {
                String imageUrl = s3Uploader.uploadFile(image); // 업로드 후 URL 반환
                imagePathList.add(imageUrl); // 리스트에 추가
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        return imagePathList;
    }

    public String saveUserImage(MultipartFile multipartFile){
        try {
            return s3Uploader.uploadFile(multipartFile); // 업로드 후 URL 반환
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    //포스트에 이미지 저장
    public List<Image> saveImagesToPost(ImageRequestDto imageRequestDto){
        Post post = postRepository.findById(imageRequestDto.getPostId())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
        System.out.println(imageRequestDto.getImages().get(0));
        List<String> saveImages = saveImages(imageRequestDto.getImages());
        List<Image> resultImages = new ArrayList<>();

        for(int i=0;i<saveImages.size();i++){
            Image image = Image.builder()
                    .imageUrl(saveImages.get(i))
                    .post(post)
                    .createdAt(LocalDateTime.now())
                    .modifiedAt(LocalDateTime.now())
                    .build();

            imageRepository.save(image);
            resultImages.add(image);
        }

        return resultImages;
    }

    public String deleteFile(String fileName){
        s3Uploader.deleteFile(fileName);
        return fileName;
    }

    public Image getImage(Long imageId){
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.IMAGE_NOT_FOUND));
    }


    public List<Image> uploadPostImage(Long postId, List<MultipartFile> multipartFiles) {
        Post post = postRepository.findById(postId).get();
        List<Image> postImageList = post.getImageList();


        //이미지 객체에서 Url만 추출
        List<String> imageUrlList = new ArrayList<>();
        for (Image image : postImageList) {
            imageUrlList.add(image.getImageUrl());
        }

        // 이미지 파일 이름만 추출
        List<String> updateImages = s3Uploader.autoImagesUploadAndDelete(imageUrlList, multipartFiles);

        // DB에서 삭제된 이미지 제거
        List<Image> updatedImages = updateImages.stream()
                .map(url -> Image.builder().imageUrl(url).post(post).build())
                .collect(Collectors.toList());

        // 기존 이미지 중 삭제된 것들 DB에서 제거
        List<Image> imagesToDelete = post.getImageList().stream()
                .filter(image -> !updateImages.contains(image.getImageUrl()))
                .collect(Collectors.toList());

        imageRepository.deleteAll(imagesToDelete); // 실제 DB에서 삭제

        return imageRepository.saveAll(updatedImages);

    }


}
