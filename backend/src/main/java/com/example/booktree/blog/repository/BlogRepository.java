package com.example.booktree.blog.repository;

import com.example.booktree.blog.entity.Blog;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Optional<Blog> findByUserId(Long userId);

    @Query("SELECT b.user.id FROM Blog b WHERE b.id = :blogId")
    Long findUserIdByBlogId(@Param("blogId") Long blogId);

    @Query("SELECT b.id FROM Blog b WHERE b.user.id = :userId")
    Long findBlogIdByUserId(@Param("userId") Long userId);




}