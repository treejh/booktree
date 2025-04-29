package com.example.booktree.LikePost.dto;

import com.example.booktree.user.entity.User;
import lombok.Getter;

@Getter
public class LikeUserListDto {
    private Long id;
    private String username;

    public LikeUserListDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername(); //
    }
}
