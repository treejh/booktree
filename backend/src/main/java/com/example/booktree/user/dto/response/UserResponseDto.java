package com.example.booktree.user.dto.response;


import com.example.booktree.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponseDto {

    @NotNull
    private Long roleId;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phoneNumber;

    private String username;

    private String ssoProvider;

    private String socialId;

    public UserResponseDto(User user){
        this.roleId = user.getRole().getId();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.username = user.getUsername();
        this.ssoProvider=user.getSsoProvider();
        this.socialId=user.getSocialId();
    }


}
