package com.example.booktree.comment.dto;

import com.example.booktree.reply.dto.ReplyDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

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
        private String userEmail;
        // 대댓글은 각 댓글에 대해 페이징 처리된 결과로 포함
        private Page<ReplyDto.Response> replies;
    }
}
