package com.example.booktree.post.repository;

import com.example.booktree.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p WHERE p.category.id = :categoryId")
    List<Post> findByCategoryId(@Param("categoryId") Long categoryId);
}
