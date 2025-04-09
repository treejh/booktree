package com.example.booktree.exception;

import lombok.Getter;

public enum ExceptionCode {
     BOARD_NOT_FOUND(404, "Board not found"),
     USER_NOT_FOUND(404, "User not found"),
     CATEGORY_NOT_FOUND(404, "Category not found"),
    USER_NOT_CATEGORY_OWNER(404, "User is not Category's owner");

    @Getter
    private double status;

    @Getter
    private String message;

    ExceptionCode(double code, String message) {
        this.status = code;
        this.message = message;
    }
}