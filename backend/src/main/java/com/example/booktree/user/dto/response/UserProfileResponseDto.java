package com.example.booktree.user.dto.response;

import com.example.booktree.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
//사용자가 수정할 수 있는
public class UserProfileResponseDto {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phoneNumber;

    private String username;

    private Long id;

    public UserProfileResponseDto(User user){
        this.username=user.getUsername();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.id=user.getId();


    }



}
