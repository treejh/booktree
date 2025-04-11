package com.example.booktree.category.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter@Setter@Builder
public class PostByCategoryResponseDto {
    private Long postId;
    private String postTitle;
    private Long view;
    private LocalDateTime create_at;
    private LocalDateTime update_at;
    // 게시글 좋아요 생긴다면 좋아요 수

}
