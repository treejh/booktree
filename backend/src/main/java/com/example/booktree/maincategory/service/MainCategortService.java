package com.example.booktree.maincategory.service;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.maincategory.dto.request.CreateMainCaterequestDto;
import com.example.booktree.maincategory.dto.response.AllMainCategoryResponseDto;
import com.example.booktree.maincategory.entity.MainCategory;
import com.example.booktree.maincategory.repository.MainCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MainCategortService {
    public final MainCategoryRepository mainCategoryRepository;


    // read
    public List<AllMainCategoryResponseDto> findAll() {
        List<MainCategory> categories = mainCategoryRepository.findAll();

        // 응답 dto로 변환
        return categories.stream()
                .map(category -> AllMainCategoryResponseDto.builder()
                        .id(category.getId())
                        .create_at(category.getCreatedAt())
                        .update_at(category.getModifiedAt())
                        .name(category.getName())
                        .build())
                .toList();
    }

    // create
    public void saveMainCate(CreateMainCaterequestDto requestDto){

        // 관리자 ? 하여튼 권한 체크 로직 필요
        mainCategoryRepository.save(requestDto.toEntity());
    }

    // update
    public void updateMainCate(Long mainCategoryId, CreateMainCaterequestDto requestDto){

        // 권한 체크 필요
        MainCategory mainCategory = mainCategoryRepository.findById(mainCategoryId)
                .orElseThrow(()->new BusinessLogicException(ExceptionCode.MAINCATEGORY_NOT_FOUNT));
        mainCategory.setName(requestDto.getName());
        mainCategoryRepository.save(mainCategory);
    }

    // delete
    public void deleteMainCate(Long mainCategoryId){

        // 마찬가지 권한 체크
        mainCategoryRepository.deleteById(mainCategoryId);
    }

    // 유효성 검사
    public boolean validateMainCate(Long mainCategoryId){
        return mainCategoryRepository.existsById(mainCategoryId);
    }
}
