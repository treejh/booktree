package com.example.booktree.category.dto.request;

import com.example.booktree.category.entity.Category;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class CreateCategoryRequestDto {
    private String categoryName;
    private Long userId;

    public Category toEntity() {
        Category category = new Category();
        category.setName(categoryName);
        return category;
    }
}
