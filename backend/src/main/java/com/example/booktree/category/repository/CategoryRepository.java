package com.example.booktree.category.repository;

import com.example.booktree.category.entity.Category;
import com.example.booktree.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    public List<Category> findByUser(User user);

    @Transactional
    @Modifying
    @Query("DELETE FROM Category f WHERE f.user = :user")
    void deleteByUser(@Param("user") User user);


}
