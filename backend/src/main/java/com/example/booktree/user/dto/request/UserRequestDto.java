package com.example.booktree.user.dto.request;


import com.example.booktree.role.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDto {

    private String email;
    private String password;
    private String phoneNumber;
}
