package com.example.booktree.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
public class BoardDto{
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Post {
        private long projectId;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Patch {
        private long projectId;
        private long memberId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response{
        @Id
        private long projectId;
        private long memberId;

    }
}