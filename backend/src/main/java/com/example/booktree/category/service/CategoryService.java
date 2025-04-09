package com.example.booktree.category.service;

import com.example.booktree.category.dto.request.CreateCategoryRequestDto;
import com.example.booktree.category.dto.response.AllCategoryResponseDto;
import com.example.booktree.category.entity.Category;
import com.example.booktree.category.repository.CategoryRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    public final CategoryRepository categoryRepository;
    public final UserService userService;

    @Transactional
    public List<AllCategoryResponseDto> findAllcategory(Long userId){
        // User 정보를 통해 카테고리들 불러오기
        List<Category> categories = categoryRepository.findByUser(userService.findById(userId));

        // 응답 dto로 변환
        List<AllCategoryResponseDto> lstDto = categories.stream()
                .map(category -> AllCategoryResponseDto.builder()
                        .id(category.getId())
                        .create_at(category.getCreatedAt())
                        .update_at(category.getModifiedAt())
                        .name(category.getName())
                        .build())
                .collect(Collectors.toList());

        // 전송
        return lstDto;
    }

    public void deleteCategory(Long categoryId, Long userId){

        // 카테고리 Id 로 찾은 userId 와 로그인된 유저 Id 가 맞는지 비교 후 삭제
        Category category = findById(categoryId);
        if(!category.getUser().getId().equals(userId)){
            throw new BusinessLogicException(ExceptionCode.USER_NOT_CATEGORY_OWNER);
        }
        // 삭제
        categoryRepository.deleteById(categoryId);
    }

    public void modCategory(Long categoryId, CreateCategoryRequestDto createCategoryRequestDto){

        // 카테고리 id로 찾은 userId와 로그인된 유저 Id가 맞는지 비교
        Category category = findById(categoryId);

        // userId 변경에 따라 변경 필요
        if(!category.getUser().getId().equals(createCategoryRequestDto.getUserId())){
            throw new BusinessLogicException(ExceptionCode.USER_NOT_CATEGORY_OWNER);
        }

        // 카테고리 이름 재설정
        category.setName(createCategoryRequestDto.getCategoryName());

        // 저장
        categoryRepository.save(category);
    }

    public void createCategory(CreateCategoryRequestDto createCategoryRequestDto){

        // dto -> entity 변환
        Category category = createCategoryRequestDto.toEntity();

        // 유저 설정 (Security에 따라 로직 변경 필요)
        category.setUser(userService.findById(createCategoryRequestDto.getUserId()));

        categoryRepository.save(category);
    }

    public Category findById(Long categoryId){
        return categoryRepository.findById(categoryId).orElseThrow(()->new BusinessLogicException(ExceptionCode.CATEGORY_NOT_FOUND));
    }
}
