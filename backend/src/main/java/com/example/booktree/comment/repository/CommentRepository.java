package com.example.booktree.comment.repository;

import com.example.booktree.comment.entity.Comment;
import com.example.booktree.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostId(Long postId, Pageable pageable);

    void deleteByPostId(Long postId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Comment f WHERE f.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Comment c WHERE c.post IN (SELECT p FROM Post p WHERE p.user = :user)")
    void deleteByPostUser(@Param("user") User user);


}
