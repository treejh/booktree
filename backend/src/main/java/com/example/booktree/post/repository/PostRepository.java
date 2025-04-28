package com.example.booktree.post.repository;

import com.example.booktree.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

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

    Page<Post> findByUserIdInOrderByCreatedAtDesc(List<Long> userIds, Pageable pageable);

    // 블로그별 게시글 조회
    List<Post> findByBlogId(Long blogId);

    // 회원별 게시글 조회
    List<Post> findByUserId(Long userId);


    // 최신순
    Page<Post> findByBlogIdOrderByCreatedAtDesc(Long blogId, Pageable pageable);

    // 인기순
    @Query("SELECT p FROM Post p WHERE p.blog.id = :blogId AND p.createdAt >= :oneWeekAgo ORDER BY p.likeCount DESC")
    Page<Post> findPopularPostsByLikesInLastWeek(@Param("blogId") Long blogId,
                                                 @Param("oneWeekAgo") LocalDateTime oneWeekAgo,
                                                 Pageable pageable);



    @Query("SELECT p.user.id FROM Post p WHERE p.id = :postId")
    Long findUserIdByPostId(@Param("postId") Long postId);


    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable); // 제목 검색

    Page<Post> findByAuthorContainingIgnoreCase(String author, Pageable pageable); // 작성자 검색

    Page<Post> findByBookContainingIgnoreCase(String book, Pageable pageable); // 책 제목 검색

    Page<Post> findByBlogIdAndTitleContaining(Long blogId, String keyword, Pageable pageable);//본인의 블로그에서 검색

    Page<Post> findByTitleContainingOrContentContaining(
            String titleKeyword,
            String contentKeyword,
            Pageable pageable
    );

    List<Post> findTop3ByOrderByViewDesc();

    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.id = :userId")
    Long countPostsByUserId(@Param("userId") Long userId);

    @Query("""
      SELECT p
      FROM Post p
      WHERE LOWER(p.title)  LIKE LOWER(CONCAT('%', :q, '%'))
         OR LOWER(p.content) LIKE LOWER(CONCAT('%', :q, '%'))
         OR LOWER(p.author)  LIKE LOWER(CONCAT('%', :q, '%'))
         OR LOWER(p.book)    LIKE LOWER(CONCAT('%', :q, '%'))
      """)
    Page<Post> searchAll(@Param("q") String q, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.blog.id = :blogId ORDER BY p.likeCount DESC")
    Page<Post> findPopularPostsByBlogId(@Param("blogId") Long blogId, Pageable pageable);


    Page<Post> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.imageList WHERE p.id IN :ids")
    List<Post> findAllByIdWithImages(@Param("ids") List<Long> ids);

}
