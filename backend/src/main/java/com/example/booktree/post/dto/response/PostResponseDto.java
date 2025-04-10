package com.example.booktree.post.dto.response;

import com.example.booktree.post.entity.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class PostResponseDto {

    private Long postId;


    @NotNull
    private Long blogId;

    @NotNull
    private Long userId;
    @NotNull
    private Long mainCategoryId;


    private Long categoryId;

    @NotBlank
    @NotNull
    private String title;

    @NotBlank
    @NotNull
    private String content;

    private String author;

    private String book;
    private LocalDateTime created_At;

    private LocalDateTime last_modified_At;


    private List<MultipartFile> images;


    public PostResponseDto(Post post){
        this.postId = post.getId();
        this.blogId=post.getBlog().getId();
        this.userId = post.getUser().getId();
        this.mainCategoryId=post.getMainCategory().getId();
        this.title=post.getTitle();
        this.content =post.getContent();
        this.author=post.getAuthor();
        this.book =post.getBook();
        this.created_At = post.getCreatedAt();
        this.last_modified_At = post.getModifiedAt();

    }


}