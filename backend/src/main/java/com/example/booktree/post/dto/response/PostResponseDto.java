package com.example.booktree.post.dto.response;

import com.example.booktree.post.entity.Post;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter@Setter
@Builder
public class PostResponseDto {
    private Long postId;
    private String title;
    private Long viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

}
