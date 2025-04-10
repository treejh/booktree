package com.example.booktree.like_comment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Data
public class LikeCommentDto {

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Post {
        private Long commentId;
        private Long userId;
    }

    // 응답용
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long commentId;
        private Long userId;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }
}
