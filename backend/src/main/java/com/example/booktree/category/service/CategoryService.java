package com.example.booktree.category.service;

import com.example.booktree.category.dto.request.CreateCategoryRequestDto;
import com.example.booktree.category.dto.response.AllCategoryResponseDto;
import com.example.booktree.category.dto.response.PostByCategoryResponseDto;
import com.example.booktree.category.entity.Category;
import com.example.booktree.category.repository.CategoryRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.maincategory.dto.response.AllMainCategoryResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.service.PostService;
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
    public final PostService postService;


    // read
    @Transactional
    public List<AllCategoryResponseDto> findAllcategory(Long userId){
        List<Category> categories = categoryRepository.findByUser(userService.findById(userId));

        List<AllCategoryResponseDto> lstDto = categories.stream()
                .map(category -> AllCategoryResponseDto.builder()
                        .id(category.getId())
                        .create_at(category.getCreatedAt())
                        .update_at(category.getModifiedAt())
                        .name(category.getName())
                        .postCount((long) category.getPostList().size()) // 리스트의 크기로 count
                        .build())
                .collect(Collectors.toList());

        return lstDto;
    }


    // delete
    @Transactional
    public void deleteCategory(Long categoryId, Long userId){

        // 카테고리 Id 로 찾은 userId 와 로그인된 유저 Id 가 맞는지 비교 후 삭제
        Category category = findById(categoryId);
        if(!category.getUser().getId().equals(userId)){
            throw new BusinessLogicException(ExceptionCode.USER_NOT_CATEGORY_OWNER);
        }
        // 삭제
        categoryRepository.deleteById(categoryId);
    }

    // update
    @Transactional
    public void modCategory(Long categoryId,Long userId, String name){

        // 카테고리 id로 찾은 userId와 로그인된 유저 Id가 맞는지 비교
        Category category = findById(categoryId);

        // userId 변경에 따라 변경 필요
        if(!category.getUser().getId().equals(userId)){
            throw new BusinessLogicException(ExceptionCode.USER_NOT_CATEGORY_OWNER);
        }

        // 카테고리 이름 재설정
        category.setName(name);

        // 저장
        categoryRepository.save(category);
    }


    // create
    @Transactional
    public void createCategory(CreateCategoryRequestDto createCategoryRequestDto,Long userId){

        // dto -> entity 변환
        Category category = createCategoryRequestDto.toEntity();

        // 유저 설정 (Security에 따라 로직 변경 필요)
        category.setUser(userService.findById(userId));

        categoryRepository.save(category);
    }

    public Category findById(Long categoryId){
        return categoryRepository.findById(categoryId).orElseThrow(()->new BusinessLogicException(ExceptionCode.CATEGORY_NOT_FOUND));
    }

    @Transactional
    public List<PostByCategoryResponseDto> getPostByCategory(Long categoryId, Long userId){

        Category category = findById(categoryId);

        // 카테고리 주인 검사
        if(!userId.equals(category.getUser().getId())){
            throw new BusinessLogicException(ExceptionCode.USER_NOT_CATEGORY_OWNER);
        }
        List<Post> posts = postService.getPostByCategory(categoryId);

        return posts.stream()
                .map(post -> PostByCategoryResponseDto.builder()
                        .postId(post.getId())
                        .create_at(post.getCreatedAt())
                        .update_at(post.getModifiedAt())
                        .view(post.getView())
                        .postTitle(post.getTitle())
                        .build())
                .toList();
    }
}
