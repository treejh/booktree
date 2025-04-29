package com.example.booktree.likepost.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LikePostResponseDto {

    private Long postId;
    private Long likeCount;
    private boolean liked; // true = 좋아요 클릭 false = 좋아요 취소
}
