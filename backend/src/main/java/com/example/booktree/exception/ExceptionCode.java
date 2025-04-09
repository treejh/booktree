package com.example.booktree.exception;

import lombok.Getter;

public enum ExceptionCode {
     BLOG_NOT_FOUND(404, "블로그를 찾을 수 없습니다."),
     USER_NOT_FOUND(404,"유저를 찾을 수 없습니다. "),
    ALREADY_HAS_BLOG(404, "블로그를 이미 가지고 있습니다."),
    USER_NOT_BLOG_OWNER(403,"해당 블로그의 소유자가 아닙니다.")
    ;

    @Getter
    private int status;

    @Getter
    private String message;

    ExceptionCode(int code, String message) {
        this.status = code;
        this.message = message;
    }
}