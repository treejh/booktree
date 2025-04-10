package com.example.booktree.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    private Long userId;


    private Long categoryId;

    @NotBlank
    @NotNull
    private String title;

    @NotBlank
    @NotNull
    private String content;

    private String author;

    private String book;

    private List<MultipartFile> images;


}
