package com.example.booktree.follow.dto.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter@Setter@Builder
public class AllFollowListResponseDto {

    private Long id;
    // 팔로워 혹은 팔로잉 유저 id를 담을 그릇
    private Long userId;
    private int count;
    private String username;
    private LocalDateTime create_at;
    private LocalDateTime update_at;
    private boolean isFollowing;
    private boolean isMe;
    private Long blogId;
    private String imageUrl;

}
