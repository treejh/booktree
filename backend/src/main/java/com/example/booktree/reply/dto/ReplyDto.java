package com.example.booktree.reply.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
public class ReplyDto {

    // 대댓글 생성 시 사용할 DTO (작성자 정보는 토큰에서 결정)
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Post {
        private Long commentId;  // 부모 댓글의 ID
        private String content;  // 대댓글 내용
    }

    // 대댓글 수정 시 사용할 DTO (replyId는 URL에서 주입)
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Patch {
        private Long replyId;
        private String content;
    }

    // 대댓글 응답용 DTO - 작성자 이메일을 포함하여 누구인지 구분 가능
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private Long replyId;
        private Long commentId;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private String userEmail;
    }
}
