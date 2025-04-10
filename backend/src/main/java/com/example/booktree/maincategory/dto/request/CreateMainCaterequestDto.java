package com.example.booktree.maincategory.dto.request;

import com.example.booktree.maincategory.entity.MainCategory;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
@Builder
public class CreateMainCaterequestDto {
    private Long userId;
    private String name;

    public MainCategory toEntity(){
        MainCategory mainCategory = new MainCategory();
        mainCategory.setName(name);
        return mainCategory;
    }
}
