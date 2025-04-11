package com.example.booktree.post.service;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.maincategory.service.MainCategortService;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MainCategortService mainCategortService;

    public List<Post> getPostByCategory(Long categoryId) {
        return postRepository.findByCategoryId(categoryId);
    }


    // 메인 카테고리별 최신순 게시글 가져오기
    public Page<Post> getPost(Pageable pageable, Long mainCategoryId) {
        // 메인 카테고리가 없을 시 예외처리
        if(!mainCategortService.validateMainCate(mainCategoryId)){
            throw new BusinessLogicException(ExceptionCode.MAINCATEGORY_NOT_FOUNT);
        }

        return postRepository.findByMainCategoryId(mainCategoryId, pageable);
    }

    // 일주일 동안 조회수 높은 게시글 가져오기
    public Page<Post> getPostByViews(Pageable pageable, Long mainCategoryId) {
        // 메인 카테고리가 없을 시 예외처리
        if (!mainCategortService.validateMainCate(mainCategoryId)) {
            throw new BusinessLogicException(ExceptionCode.MAINCATEGORY_NOT_FOUNT);
        }

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return postRepository.findTopPostsByViewsInLastWeek(mainCategoryId, oneWeekAgo, pageable);
    }
}
