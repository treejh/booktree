package com.example.booktree.exception;

import lombok.Getter;

public enum ExceptionCode {
     BOARD_NOT_FOUND(404, "Board not found"),
    S3_DELETE_ERROR(404,"S3 이미지 삭제 에러"),
     USER_NOT_FOUND(404, "User not found"),
     CATEGORY_NOT_FOUND(404, "Category not found"),
    IMAGE_NOT_FOUND(404,"해당되는 이미지를 찾을 수 없습니다."),
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