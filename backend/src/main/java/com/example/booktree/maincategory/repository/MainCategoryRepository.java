package com.example.booktree.maincategory.repository;

import com.example.booktree.maincategory.entity.MainCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MainCategoryRepository extends JpaRepository<MainCategory,Long> {
}
