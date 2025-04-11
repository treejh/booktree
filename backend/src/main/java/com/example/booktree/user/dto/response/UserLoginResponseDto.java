package com.example.booktree.user.dto.response;


import com.example.booktree.user.entity.User;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLoginResponseDto {


    private String username;
    private String email;
    private Long userId;

    public UserLoginResponseDto(User user, String accessToken){
        this.username=user.getUsername();
        this.email = user.getEmail();
        this.userId = user.getId();
    }
}
