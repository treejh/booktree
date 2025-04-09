package com.example.booktree.post.service;


import com.example.booktree.post.dto.request.PostRequestDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Post createPost(PostRequestDto postRequestDto){
        Post post = new Post();

        return post;
    }


}
