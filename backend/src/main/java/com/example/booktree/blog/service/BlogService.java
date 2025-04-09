package com.example.booktree.blog.service;

import com.example.booktree.blog.dto.request.BlogRequestDto;
import com.example.booktree.blog.entity.Blog;
import com.example.booktree.blog.repository.BlogRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.UserService;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlogService {

        private final BlogRepository blogRepository;
        private final UserService userService;

    public Blog createBlog(BlogRequestDto blogRequestDto) {
        //블로그 가지고 있는지 확인
        validationBlog(blogRequestDto.getUser_id());
        User user = userService.findUserById(blogRequestDto.getUser_id());
        Blog blog = Blog.builder()
                .name(blogRequestDto.getName())
                .user(user)
                .profile(blogRequestDto.getProfile())
                .notice(blogRequestDto.getNotice())
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        return blogRepository.save(blog);
    }

    public Blog findBlogByBlogId(Long blogId) {
        return verifiedBlog(blogId);
    }

    //update
    public Blog updateBlog(BlogRequestDto blogRequestDto, Long blogId) {

        //검증
        Blog findBlog = findBlogByBlogId(blogId);
        validationBlogOwner(blogRequestDto.getUser_id(),blogId);

        Optional.ofNullable(blogRequestDto.getName()).ifPresent(findBlog::setName);
        Optional.ofNullable(blogRequestDto.getProfile()).ifPresent(findBlog::setProfile);
        Optional.ofNullable(blogRequestDto.getNotice()).ifPresent(findBlog::setNotice);
        findBlog.setModifiedAt(LocalDateTime.now());

        return blogRepository.save(findBlog);
    }

    // Delete
    public void deleteBlog(Long userId, Long blogId) {
        //검증
        Blog findBlog = findBlogByBlogId(blogId);
        validationBlogOwner(userId,blogId);

        blogRepository.delete(findBlog);
    }



    //수정을 요청한 사람이, 블로그의 주인이 맞는지 확인
    public void validationBlogOwner(Long getBlogUserId, Long userId){
        if(userId.equals(getBlogUserId)){
            throw new BusinessLogicException(ExceptionCode.USER_NOT_BLOG_OWNER);
        }
    }

    //현재는 하나의 블로그만 만들 수 있다는 가정 하에 validation 검사
    //블로그가 존재하는지 확인
    public void validationBlog(Long userId) {
        Optional<Blog> blogOptional = blogRepository.findByUserId(userId);
        if (blogOptional.isPresent()) {
            throw new BusinessLogicException(ExceptionCode.ALREADY_HAS_BLOG);
        }
    }


    //해당 블로그가 존재하는지 확인
    public Blog verifiedBlog(long blogId) {
        Optional<Blog> blog = blogRepository.findById(blogId);
        return blog.orElseThrow(() -> new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND));
    }



    }