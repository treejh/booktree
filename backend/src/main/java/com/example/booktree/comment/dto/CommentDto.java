package com.example.booktree.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Data
public class CommentDto {

    // 댓글 생성 DTO
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Post {
        private Long postId;
        private String content;
    }

    // 댓글 수정 DTO
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Patch {
        private Long commentId;
        private String content;
    }

    // 댓글 응답 DTO
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private Long commentId;
        private String content;
        private Long postId;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private String userEmail;
    }
}
