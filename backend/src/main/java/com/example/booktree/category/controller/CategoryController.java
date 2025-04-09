package com.example.booktree.category.controller;

import com.example.booktree.category.dto.request.CreateCategoryRequestDto;
import com.example.booktree.category.dto.response.AllCategoryResponseDto;
import com.example.booktree.category.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
@Tag(name = "카테고리 관리 컨트롤러")
public class CategoryController {

    public final CategoryService categoryService;

    @GetMapping("/allcategory")
    @Operation(
            summary = "유저의 모든 카테고리 찾기 기능",
            description = "유저의 ID를 통해 유저가 등록한 모든 카테고리를 반환하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<List<AllCategoryResponseDto>> getAllCategory(@RequestParam Long userId) {

        // 인가 로직

        List<AllCategoryResponseDto> userCategories = categoryService.findAllcategory(userId);

        return ResponseEntity.ok(userCategories);
    }

    @DeleteMapping("/deletecategory/{categoryId}")
    @Operation(
            summary = "카테고리 삭제 기능",
            description = "인가된 유저의 ID를 통해 특정 카테고리를 삭제하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> deleteCategory(@RequestParam Long categoryId, @RequestBody Long userId) {

        // 인가 로직

        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok("카테고리가 삭제되었습니다.");
    }

    @PatchMapping("/modcategory/{categoryId}")
    @Operation(
            summary = "카테고리 수정 기능",
            description = "인가된 유저의 ID를 통해 특정 카테고리를 수정하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> modCategory(@RequestParam Long categoryId, @RequestBody CreateCategoryRequestDto createCategoryRequestDto) {

        // 인가 로직

        categoryService.modCategory(categoryId, createCategoryRequestDto.getCategoryName());
        return ResponseEntity.ok("카테고리가 수정되었습니다.");
    }

    @PostMapping("/cretaecategory")
    @Operation(
            summary = "카테고리 생성 기능",
            description = "입력된 내용을 바탕으로 카테고리 생성 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> createCategory(@RequestBody CreateCategoryRequestDto createCategoryRequestDto) {

        categoryService.createCategory(createCategoryRequestDto.getUserid(),createCategoryRequestDto.getCategoryName());
        return ResponseEntity.ok("카테고리가 생성되었습니다.");
    }

}
