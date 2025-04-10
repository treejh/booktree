package com.example.booktree.exception;

import lombok.Getter;

public enum ExceptionCode {
     BOARD_NOT_FOUND(404, "Board not found"),

    EMAIL_ALREADY_EXISTS(405, "이미 존재하는 이메일입니다! 다른 이메일을 사용해 주세요."),
    USER_NOT_FOUND(406, "사용자를 찾을 수 없습니다."),
    ROLE_NOT_AUTH(407, "일반 회원 권한이 없습니다."),
    INVALID_TOKEN(408, "유효하지 않은 토큰입니다.");

    @Getter
    private double status;

    @Getter
    private String message;

    ExceptionCode(double code, String message) {
        this.status = code;
        this.message = message;
    }
}