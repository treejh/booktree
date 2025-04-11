package com.example.booktree.exception;

import lombok.Getter;

public enum ExceptionCode {
     BLOG_NOT_FOUND(404, "블로그를 찾을 수 없습니다."),
    S3_DELETE_ERROR(404, "이미지를 삭제할 수 없습니다."),
     USER_NOT_FOUND(404,"유저를 찾을 수 없습니다. "),
    ALREADY_HAS_BLOG(404, "블로그를 이미 가지고 있습니다."),
    USER_NOT_BLOG_OWNER(403,"해당 블로그의 소유자가 아닙니다."),
    CATEGORY_NOT_FOUND(404, "카테고리를 찾을 수 없습니다. "),
    USER_NOT_CATEGORY_OWNER(404, "해당 카테고리의 소유자가 아닙니다."),
     MAINCATEGORY_NOT_FOUNT(404, "해당 메인카테고리를 찾을 수 없습니다."),
    POST_NOT_FOUND(404,"카테고리를 찾을 수 없습니다. "),
    IMAGE_NOT_FOUND(404,"이미지를 찾을 수 없습니다."),
    ROLE_NOT_FOUND(404, "존재하지 않은 역할입니다."),
    ALREADY_HAS_EMAIL(404,"이미 존재하는 이메일입니다."),
    ALREADY_HAS_PHONENUMBER(404,"이미 존재하는 전화번호입니다."),
    USER_NOT_POST_OWNER(403, "해당 게시글의 소유자가 아닙니다.");
    ;



//    BOARD_NOT_FOUND(404, "Board not found"),
//     USER_NOT_FOUND(404, "User not found"),
//     CATEGORY_NOT_FOUND(404, "Category not found"),
//    USER_NOT_CATEGORY_OWNER(404, "User is not Category's owner");

    @Getter
    private int status;

    @Getter
    private String message;

    ExceptionCode(int code, String message) {
        this.status = code;
        this.message = message;
    }
}