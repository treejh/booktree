package com.example.booktree.post.dto.response;

import com.example.booktree.post.entity.Post;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostFollowingPageDto {
    private Long postId;
    private String title;
    private Long viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public PostFollowingPageDto(Post post){
        this.postId = post.getId();
        this.title = post.getTitle();
        this.viewCount = post.getView();
        this.createdAt = post.getCreatedAt();
        this.modifiedAt = post.getModifiedAt();
    }

}
