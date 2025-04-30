package com.example.booktree.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class PostRequestDto {

    @NotNull
    private Long mainCategoryId;

    @NotNull
    private Long blogId;

//    @NotNull
//    private Long userId;


    private Long categoryId;

    @NotBlank
    @NotNull
    private String title;

    @NotBlank
    @NotNull
    private String content;

    private String author;

    private String book;

    private List<MultipartFile> images = new ArrayList<>(); // 이미지 안보내도 되도록

    @NotNull
    private String contentParts; // 추가

    @Getter
    @Setter
    public static class ContentPart {
        private String type; // "text" or "image"
        private String data; // text일 때는 텍스트, image일 때는 null
        private Integer index; // image일 때는 이미지 번호
    }





}
