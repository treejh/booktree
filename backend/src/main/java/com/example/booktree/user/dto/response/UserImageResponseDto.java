package com.example.booktree.user.dto.response;


import com.example.booktree.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserImageResponseDto {

    private String imageUrl;


    public UserImageResponseDto(String imageUrl){
      this.imageUrl=imageUrl;
    }

}
