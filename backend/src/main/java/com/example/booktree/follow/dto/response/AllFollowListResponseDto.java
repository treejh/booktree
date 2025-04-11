package com.example.booktree.follow.dto.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter@Setter@Builder
public class AllFollowListResponseDto {

    private Long id;
    private int count;
    private String username;
    private LocalDateTime create_at;
    private LocalDateTime update_at;

}
