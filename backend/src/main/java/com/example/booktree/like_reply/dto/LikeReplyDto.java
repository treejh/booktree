package com.example.booktree.like_reply.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class LikeReplyDto {

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Post {
        // 좋아요할 대댓글의 ID
        private Long replyId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private Long likeReplyId;
        private Long replyId; // 좋아요 대상 대댓글의 ID
        private Long userId; // 좋아요를 누른 사용자의 ID
        private Long likeCount;
    }
}
