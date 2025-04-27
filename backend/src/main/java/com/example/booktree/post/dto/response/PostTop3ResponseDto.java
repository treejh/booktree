package com.example.booktree.post.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder@Getter@Setter
public class PostTop3ResponseDto {
    private Long id;
    private String title;
    private Long viewCount;
    private String mainCategory;
    private String imageUrl;
}
