package com.example.booktree.blog.service;


import com.example.booktree.blog.entity.Blog;
import com.example.booktree.blog.repository.BlogRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class BlogService {

        private final BlogRepository blogRepository;

        //Create
        public Blog createBlog(Blog blog) {
            return blogRepository.save(blog);
        }

        // Read
        public Blog findBlog(long projectId) {
            Blog blog = verifiedBlog(projectId);
            return blog;
        }

    public Blog verifiedBlog(long projectId) {
        Optional<Blog> blog = blogRepository.findById(projectId);
        return blog.orElseThrow(() -> new BusinessLogicException(ExceptionCode.BOARD_NOT_FOUND));
    }

        // Update
//        public Blog updateBlog(Blog blog) {
//            //Blog findBlog = verifiedBlog(blog.getProjectId());
//            //Optional.ofNullable(blog.getMemberId()).ifPresent(findBlog::setMemberId);
//            //Optional.ofNullable(blog.getRecruitmentSize()).ifPresent(findBlog::setRecruitmentSize);
//            return blogRepository.save(findBlog);
//        }
//
//        // Delete
//        public void deleteBlog(long ProjectId) {
//             blog = verifiedBlog(ProjectId);
//            blogRepository.delete(blog);
//        }

        // 멤버 검증

    }