package com.example.booktree.post.dto.response;

import com.example.booktree.post.entity.Post;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Getter@Setter
@Builder
public class PostResponseDto {
    private Long postId;
    private String title;
    private Long viewCount;
    private int ranking;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private String imageUrl;
    private double score;

    private String content; // 추가
    private String username; // 추가 (user.getNickname() 또는 user.getName())
    private Long categoryId; // 추가
    private String category; // 추가 (category.getName())

}
