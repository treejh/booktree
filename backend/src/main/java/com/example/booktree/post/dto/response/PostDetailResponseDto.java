package com.example.booktree.post.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class PostDetailResponseDto {

    private Long postId;
    private String title;
    private String content;
    private String username;
    private List<String> imageUrls;
    private Long viewCount;
    private Long likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    //  새 필드들
    private String mainCategory;
    private String category;
    private Long blogId;
    private String author;
    private String book;


}
