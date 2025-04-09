package com.example.booktree.exception;

import lombok.Getter;

public enum ExceptionCode {
     BOARD_NOT_FOUND(404, "Board not found");

    @Getter
    private double status;

    @Getter
    private String message;

    ExceptionCode(double code, String message) {
        this.status = code;
        this.message = message;
    }
}