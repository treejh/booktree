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

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Post {
        private Long postId;
        private String content;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Patch {
        private Long commentId;
        private String content;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private Long commentId;
        private String content;
        private Long postId;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private String username;
        // 대댓글은 각 댓글에 대해 페이징 처리된 결과로 포함
        private Long userId;
        private long likeCount;
        private Page<ReplyDto.Response> replies;
        private boolean isFollowing;
        private boolean isMe;
    }
}