package com.example.booktree.utils;


import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class S3Uploader {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private final AmazonS3 amazonS3;

    // S3에 이미지 등록

    public String S3_FIX_URL = "https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/";

    // S3에 이미지 등록
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        String fileName = multipartFile.getOriginalFilename();

        //파일 형식 구하기
        String ext = fileName.split("\\.")[1];
        String contentType = "";

        //content type을 지정해서 올려주지 않으면 자동으로 "application/octet-stream"으로 고정이 되서 링크 클릭시 웹에서 열리는게 아니라 자동 다운이 시작됨.
        switch (ext) {
            case "jpeg":
                contentType = "image/jpeg";
                break;
            case "png":
                contentType = "image/png";
                break;
            case "txt":
                contentType = "text/plain";
                break;
            case "csv":
                contentType = "text/csv";
                break;
        }

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(contentType);

            //S3에 파일 업로드
            amazonS3.putObject(new PutObjectRequest(bucket, fileName, multipartFile.getInputStream(), metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        } catch (AmazonServiceException e) {
            e.printStackTrace();
        } catch (SdkClientException e) {
            e.printStackTrace();
        }

//        //object 정보 가져오기 (디버깅용) 데이터 잘 들어갔는지 확인하려고
//        ListObjectsV2Result listObjectsV2Result = amazonS3.listObjectsV2(bucket);
//        List<S3ObjectSummary> objectSummaries = listObjectsV2Result.getObjectSummaries();

//        for (S3ObjectSummary object: objectSummaries) {
//            System.out.println("object = " + object.toString());
//        }
        return amazonS3.getUrl(bucket, fileName).toString();
    }

    // S3에 이미지 삭제
    public void deleteFile(String imageUrl) {
        try {
            String key = imageUrl.contains(".com/") ? imageUrl.split(".com/")[1] : imageUrl;
            System.out.println("!! imageurl : " + key);
            amazonS3.deleteObject(bucket, key);

        } catch (AmazonServiceException e) {
            System.err.println(e.getErrorMessage());
        } catch (Exception exception) {
            throw new BusinessLogicException(ExceptionCode.S3_DELETE_ERROR);
        }
    }

    // 이미지 리스트를 받아서, 새로 추가된 이미지는 추가하고 삭제된 이미지는 삭제함
    public List<String> autoImagesUploadAndDelete(List<String> beforePostImages, List<MultipartFile> multipartFiles) {
        // 이미지 파일 이름만 추출
        beforePostImages.replaceAll(s -> s.split(".com/")[1]);

        // 변경된 이미지 리스트
        List<String> afterPostImages = new ArrayList<>();
        
        // 새로 추가된 이미지
        List<String> newPostImages = new ArrayList<>();

        for (MultipartFile multipartFile : multipartFiles) {
            afterPostImages.add(multipartFile.getOriginalFilename());
            newPostImages.add(multipartFile.getOriginalFilename());
        }
        //System.out.println("!! " + afterPostImages.toString());

        // 새로 추가된 이미지
        newPostImages.removeAll(beforePostImages);
        //System.out.println("!! 새로 추가됨 : " + newPostImages.toString());

        if (!newPostImages.isEmpty()) {
            newPostImages.stream()
                    .forEach(imageName -> {
                        MultipartFile upload = multipartFiles.stream()
                                .filter(multipartFile -> multipartFile.getOriginalFilename().equals(imageName))
                                .map(MultipartFile.class::cast)
                                .findFirst()
                                .orElse(null);
                        System.out.println("!! name : " + upload.getOriginalFilename());
                        try {
                            uploadFile(upload);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });
        }

        // 삭제된 이미지
        beforePostImages.removeAll(afterPostImages);
        //System.out.println("!! 삭제됨 : " + beforePostImages.toString());
        if (!beforePostImages.isEmpty()) {
            beforePostImages.stream().forEach(imageName -> deleteFile(imageName));
        }

        // 새로운 이미지 설정
        for (int i = 0; i < afterPostImages.size(); i++) {
            afterPostImages.set(i, S3_FIX_URL + afterPostImages.get(i));
        }

        return afterPostImages;
    }

}
