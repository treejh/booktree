package com.example.booktree.exception;

import lombok.Getter;

public enum ExceptionCode {
     BOARD_NOT_FOUND(404, "Board not found"),
    S3_DELETE_ERROR(404,"S3 이미지 삭제 에러");

    @Getter
    private double status;

    @Getter
    private String message;

    ExceptionCode(double code, String message) {
        this.status = code;
        this.message = message;
    }
}