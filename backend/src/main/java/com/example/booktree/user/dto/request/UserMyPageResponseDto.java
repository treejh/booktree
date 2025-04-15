package com.example.booktree.user.dto.request;

import com.example.booktree.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;

public class UserMyPageResponseDto {


    private String username;
    private LocalDateTime createdAt;

    public UserMyPageResponseDto(User user){
        this.username  = user.getUsername();
        this.createdAt=user.getCreatedAt();
    }

}
