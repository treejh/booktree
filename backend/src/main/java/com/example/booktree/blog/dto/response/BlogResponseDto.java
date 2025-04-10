package com.example.booktree.blog.dto.response;


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
    private Long blog_id;

    public BlogResponseDto(Blog blog){

        this.name= blog.getName();
        this.blog_id = blog.getId();
        this.profile= blog.getProfile();
        this.notice = blog.getNotice();
        this.name = blog.getName();
    }
}
