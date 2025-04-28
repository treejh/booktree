package com.example.booktree.user.dto.response;

import com.example.booktree.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
//다른 사용자가 볼 수 있는
public class UserMyPageResponseDto {

    private String username;
    private String imageUrl;
    private LocalDateTime createdAt;

    public UserMyPageResponseDto(User user){
        this.username  = user.getUsername();
        this.createdAt=user.getCreatedAt();
        String image = user.getImage();
        this.imageUrl = (image == null || image.isEmpty())
                ? "https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/default_profile.png"
                : image;

    }

}
