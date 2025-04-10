package com.example.booktree.post.service;


import com.example.booktree.blog.service.BlogService;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.image.service.ImageService;
import com.example.booktree.maincategory.entity.MainCategory;
import com.example.booktree.maincategory.repository.MainCategoryRepository;
import com.example.booktree.post.dto.request.PostRequestDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import com.example.booktree.user.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final MainCategoryRepository mainCategoryRepository;
    private final BlogService blogService;
    private final ImageService imageService;


    public Post createPost(PostRequestDto postRequestDto){

        Post post = Post.builder()
                .mainCategory(mainCategoryRepository.findById(postRequestDto.getMainCategoryId()).get())
                .blog(blogService.findBlogByBlogId(postRequestDto.getBlogId()))
                .user(userRepository.findById(postRequestDto.getUserId()).get())
                .author(postRequestDto.getAuthor())
                .book(postRequestDto.getBook())
                .title(postRequestDto.getTitle())
                .content(postRequestDto.getContent())
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();
        Post createPost = postRepository.save(post);

        //이미지 테이블에도 저장
        imageService.convertStringToImage(imageService.saveImages(postRequestDto.getImages()),createPost);

        return post;
    }

    public Post findPostById(Long postId){
        return postRepository.findById(postId)
                .orElseThrow(()->new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

    }
//
//    public Post updatePost(Long postId){
//
//    }


}
