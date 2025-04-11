package com.example.booktree.post.repository;

import com.example.booktree.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post,Long> {

    @Query("SELECT p FROM Post p WHERE p.category.id = :categoryId")
    List<Post> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT p FROM Post p WHERE p.mainCategory.id = :mainCategoryId")
    Page<Post> findByMainCategoryId(@Param("mainCategoryId") Long mainCategoryId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.mainCategory.id = :mainCategoryId AND p.createdAt >= :oneWeekAgo ORDER BY p.view DESC")
    Page<Post> findTopPostsByViewsInLastWeek(@Param("mainCategoryId") Long mainCategoryId,
                                             @Param("oneWeekAgo") LocalDateTime oneWeekAgo,
                                             Pageable pageable);
}
