package com.example.booktree.blog.dto.request;


import com.example.booktree.blog.entity.Blog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class BlogRequestDto {

    private String name;
    private String profile;
    private String notice;


}
