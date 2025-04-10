package com.example.booktree.maincategory.dto.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter@Setter
@Builder
public class AllMainCategoryResponseDto {
    private Long id;
    private String name;
    private LocalDateTime create_at;
    private LocalDateTime update_at;
}
