package com.example.booktree.likecomment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class LikeCommentDto {

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Post {
        private Long commentId;
    }

    // 응답용
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private Long likeCommentId;
        private Long commentId; // 좋아요 대상 댓글의 ID
        private Long userId; // 좋아요를 누른 사용자의 ID
    }
}
