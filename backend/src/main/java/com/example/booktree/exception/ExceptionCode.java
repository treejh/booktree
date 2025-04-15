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
    USER_NOT_POST_OWNER(403, "해당 게시글의 소유자가 아닙니다."),
    USER_NOT_OWNER(404, "해당 유저의 소유자가 아닙니다."),
    LIKE_NOT_FOUND(404, "해당 유저가 해당 게시물에 좋아요를 누른 기록이 없습니다."),
    ALREADY_LIKED(404, "이미 좋아요를 누른 상태입니다."),
    INVALID_PASSWORD(404, "비밀번호가 일치하지 않습니다."),
    S3_UPLOAD_ERROR(500, "이미지 업로드에 실패했습니다."),
    INVALID_SEARCH_TYPE(404,"잘못된 검색 유형입니다."),
    CANNOT_LIKE_OWN_POST(405, "자신이 작성한 게시글에는 좋아요를 누를 수 없습니다."),
    USER_NOT_LOGGED_IN(403, "아직 로그인 상태가 아니어서 좋아요를 누를 권한이 없습니다.")

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