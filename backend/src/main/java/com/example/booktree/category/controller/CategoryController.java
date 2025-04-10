package com.example.booktree.category.controller;

import com.example.booktree.category.dto.request.CreateCategoryRequestDto;
import com.example.booktree.category.dto.response.AllCategoryResponseDto;
import com.example.booktree.category.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "카테고리 관리 컨트롤러")
public class CategoryController {

    public final CategoryService categoryService;

    @GetMapping("/category/allcategory")
    @Operation(
            summary = "유저의 모든 카테고리 찾기 기능",
            description = "유저의 ID를 통해 유저가 등록한 모든 카테고리를 반환하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?>  getAllCategory(@RequestBody Long userId) {

        // 인가 로직
        List<AllCategoryResponseDto> response = categoryService.findAllcategory(userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/category/deletecategory/{categoryId}")
    @Operation(
            summary = "카테고리 삭제 기능",
            description = "인가된 유저의 ID를 통해 특정 카테고리를 삭제하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId, @RequestBody Long userId) {

        // 인가 로직
        categoryService.deleteCategory(categoryId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/category/modcategory/{categoryId}")
    @Operation(
            summary = "카테고리 수정 기능",
            description = "인가된 유저의 ID를 통해 특정 카테고리를 수정하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> modCategory(@PathVariable Long categoryId, @RequestBody CreateCategoryRequestDto createCategoryRequestDto) {

        // 인가 로직
        categoryService.modCategory(categoryId, createCategoryRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/category/cretaecategory")
    @Operation(
            summary = "카테고리 생성 기능",
            description = "입력된 내용을 바탕으로 카테고리 생성 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> createCategory(@RequestBody CreateCategoryRequestDto createCategoryRequestDto) {

        categoryService.createCategory(createCategoryRequestDto);
        return ResponseEntity.ok("카테고리가 생성되었습니다.");
    }

}
