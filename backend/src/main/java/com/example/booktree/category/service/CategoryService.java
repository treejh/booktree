package com.example.booktree.category.service;

import com.example.booktree.category.dto.response.AllCategoryResponseDto;
import com.example.booktree.category.entity.Category;
import com.example.booktree.category.repository.CategoryRepository;
import com.example.booktree.user.entity.User;
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
//    public final UserRepository userRepository;

    @Transactional
    public List<AllCategoryResponseDto> findAllcategory(Long userId){
//        List<Category> categories = categoryRepository.findByUser(userRepository.findById(userId));


        // 테스트를 위한 셈플 데이터
        User user = new User();
        user.setId(userId);
        user.setEmail("example@example.com");
        user.setPassword("password123");
        user.setPhoneNumber("010-1234-5678");
        user.setUsername("exampleUser");


        List<Category> categories = categoryRepository.findByUser(user);

        List<AllCategoryResponseDto> lstDto = categories.stream()
                .map(category -> AllCategoryResponseDto.builder()
                        .id(category.getId())
                        .create_at(category.getCreatedAt())
                        .update_at(category.getModifiedAt())
                        .name(category.getName())
                        .build())
                .collect(Collectors.toList());

        return lstDto;
    }

    public void deleteCategory(Long categoryId){
        categoryRepository.deleteById(categoryId);
    }

    public void modCategory(Long categoryId, String name){
        Category category = categoryRepository.findById(categoryId).get();
        category.setName(name);
        categoryRepository.save(category);
    }

    public void createCategory(Long userId, String name){
        // 테스트를 위한 셈플 데이터
        User user = new User();
        user.setId(userId);
        user.setEmail("example@example.com");
        user.setPassword("password123");
        user.setPhoneNumber("010-1234-5678");
        user.setUsername("exampleUser");

        Category category = new Category();
        category.setName(name);
//        category.setUser(userRepository.findById(userId));
        category.setUser(user);
        categoryRepository.save(category);
    }


}
