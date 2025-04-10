package com.example.booktree.reply.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Data
public class ReplyDto {

    // 대댓글 생성
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Post {
        private Long commentId;  // 부모 댓글의 ID
        private Long userId;     // 대댓글 작성자 ID
        private String content;  // 대댓글 내용
    }

    // 대댓글 수정
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Patch {
        private Long replyId;    // 수정할 대댓글의 ID
        private String content;  // 업데이트할 내용
    }

    // 대댓글 응답용
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private Long replyId;
        private Long commentId;
        private Long userId;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }
}
