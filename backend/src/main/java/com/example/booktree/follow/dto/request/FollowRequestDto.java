package com.example.booktree.follow.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter@Builder
public class FollowRequestDto {

    private Long followerId;
    private Long followeeId;

}
