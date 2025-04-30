package com.example.booktree.category.controller;

import com.example.booktree.category.dto.request.CreateCategoryRequestDto;
import com.example.booktree.category.dto.response.AllCategoryResponseDto;
import com.example.booktree.category.dto.response.PostByCategoryResponseDto;
import com.example.booktree.category.service.CategoryService;
import com.example.booktree.jwt.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "카테고리 관리 컨트롤러")
@Slf4j
public class CategoryController {

    public final CategoryService categoryService;
    public final TokenService tokenService;

    @GetMapping("/get/allcategory")
    @Operation(
            summary = "유저의 모든 카테고리 찾기 기능",
            description = "로그인한 유저의 ID를 통해 유저가 등록한 모든 카테고리를 반환하는 메서드 (마이 페이지)",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> getAllCategory() {

        Long userId = tokenService.getIdFromToken();
        // 인가 로직
        List<AllCategoryResponseDto> response = categoryService.findAllcategory(userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get/{userid}")
    @Operation(
            summary = "유저의 모든 카테고리 찾기 기능",
            description = "선택한 유저의 ID를 통해 유저가 등록한 모든 카테고리를 반환하는 메서드 (게시글 상세 보기)",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> getAllCategory(@PathVariable("userid") Long userid) {

        // 인가 로직
        List<AllCategoryResponseDto> response = categoryService.findAllcategory(userid);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{categoryId}")
    @Operation(
            summary = "카테고리 삭제 기능",
            description = "인가된 유저의 ID를 통해 특정 카테고리를 삭제하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> deleteCategory(@PathVariable("categoryId") Long categoryId) {

        Long userId = tokenService.getIdFromToken();
        categoryService.deleteCategory(categoryId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/patch/{categoryId}")
    @Operation(
            summary = "카테고리 수정 기능",
            description = "인가된 유저의 ID를 통해 특정 카테고리를 수정하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> modCategory(@PathVariable("categoryId") Long categoryId, @RequestBody CreateCategoryRequestDto createCategoryRequestDto) {
        Long userId = tokenService.getIdFromToken();
        String name = createCategoryRequestDto.getCategoryName();
        categoryService.modCategory(categoryId, userId, name);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/create")
    @Operation(
            summary = "카테고리 생성 기능",
            description = "입력된 내용을 바탕으로 카테고리 생성 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> createCategory(@RequestBody CreateCategoryRequestDto createCategoryRequestDto) {

        Long userId = tokenService.getIdFromToken();
        categoryService.createCategory(createCategoryRequestDto, userId);
        return ResponseEntity.ok("카테고리가 생성되었습니다.");
    }

    @GetMapping("/get/{categoryId}/posts")
    @Operation(
            summary = "카테고리별 게시글 찾기 기능",
            description = "유저 아이디와 카테고리 작성자 ID를 비교 후 게시글 정보를 가공해 사용자에게 제공하는 메서드",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> getPosts(@PathVariable("categoryId") Long categoryId) {

        Long userId= tokenService.getIdFromToken();
        List<PostByCategoryResponseDto> response = categoryService.getPostByCategory(categoryId, userId);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    @GetMapping("/get/category/{categoryId}/posts")
    @Operation(
            summary = "카테고리별 게시글 찾기 기능",
            description = "카테고리 아이디를 통해서 게시글을 사용자에게 제공하는 메서드 ",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> getPostsByCategoryId(@PathVariable("categoryId") Long categoryId,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "8") int size) {

        Page<PostByCategoryResponseDto> response = categoryService.getPostByCategoryId(categoryId,page,size);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    @GetMapping("/get/category/{categoryId}")
    @Operation(
            summary = "카테고리 아이디로, 카테고리 정보 조회하는 기능 ",
            description = "카테고리 아이디를 통해서 카테고리 정보를 사용자에게 제공하는 기능 ",
            tags = "카테고리 관리 컨트롤러"
    )
    public ResponseEntity<?> getCategoryByCategoryId(@PathVariable("categoryId") Long categoryId) {
        AllCategoryResponseDto response = categoryService.getCategoryByCategoryID(categoryId);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }




}
