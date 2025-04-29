package com.example.booktree.blog.dto.response;


import static com.example.booktree.utils.ConstData.DEFAULT_IMAGE;

import com.example.booktree.blog.entity.Blog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter

public class BlogResponseDto {

    private String name;
    private String profile;
    private String notice;
    private Long blogId;
    private String ownerUsername; // 추가
    private String ownerImageUrl; //유저 이미지 추가

    public BlogResponseDto(Blog blog){

        this.blogId = blog.getId();
        this.profile= blog.getProfile();
        this.notice = blog.getNotice();
        this.name = blog.getName();
        String image = blog.getUser().getImage();
        this.ownerImageUrl = (image == null || image.isEmpty())
                ? DEFAULT_IMAGE
                : image;

        this.ownerUsername = blog.getUser().getUsername(); // 추가
    }
}
