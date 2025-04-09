package com.example.booktree.category.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class CreateCategoryRequestDto {
    private Long userid;
    private String categoryName;
}
