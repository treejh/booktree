package com.example.booktree.category.repository;

import com.example.booktree.category.entity.Category;
import com.example.booktree.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    public List<Category> findByUser(User user);
}
