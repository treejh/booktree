package com.example.booktree.category.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter@Setter
@Builder
@ToString
public class AllCategoryResponseDto {
    private Long id;
    private String name;
    private LocalDateTime create_at;
    private LocalDateTime update_at;
    private Long postCount;
}
