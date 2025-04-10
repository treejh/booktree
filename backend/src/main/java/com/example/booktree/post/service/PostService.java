package com.example.booktree.post.service;

import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public List<Post> getPostByCategory(Long categoryId) {
        return postRepository.findByCategoryId(categoryId);
    }
}
