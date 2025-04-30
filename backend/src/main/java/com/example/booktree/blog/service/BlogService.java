package com.example.booktree.blog.service;

import com.example.booktree.blog.dto.request.BlogRequestDto;
import com.example.booktree.blog.dto.response.BlogResponseDto;
import com.example.booktree.blog.entity.Blog;
import com.example.booktree.blog.repository.BlogRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.user.entity.User;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.user.service.UserService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlogService {

        private final BlogRepository blogRepository;
        private final UserService userService;
        private final TokenService tokenService;


        @Transactional
     public Blog createBlog(BlogRequestDto blogRequestDto) {
        //블로그 가지고 있는지 확인
        Long userId = tokenService.getIdFromToken();


        //가지고 오는지 확인
        validationBlog(userId);
        User user = userService.findById(userId);
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

    @Transactional
    public Blog findBlogByBlogId(Long blogId) {
        return verifiedBlog(blogId);
    }

    @Transactional
    public Blog findBlogByToken() {
        Long userId = tokenService.getIdFromToken();
        User user = userService.findById(userId);

        List<Blog> blogList = user.getBlogList();
        if (blogList == null || blogList.isEmpty()) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND);
        }

        Blog blog = blogList.get(0); // 첫 번째 블로그 가져오기

        return verifiedBlog(blog.getId());
    }

    @Transactional
    public Blog updateBlog(BlogRequestDto blogRequestDto) {
        Long userId = tokenService.getIdFromToken();

        Blog findBlog = getFirstBlogOfUser(userId);
        // 검증
        validationBlogOwner(userId, findBlog.getUser().getId());

        Optional.ofNullable(blogRequestDto.getName()).ifPresent(findBlog::setName);
        Optional.ofNullable(blogRequestDto.getProfile()).ifPresent(findBlog::setProfile);
        Optional.ofNullable(blogRequestDto.getNotice()).ifPresent(findBlog::setNotice);
        findBlog.setModifiedAt(LocalDateTime.now());

        return blogRepository.save(findBlog);
    }


    @Transactional
    // Delete
    public void deleteBlog() {
        Long userId = tokenService.getIdFromToken();
        Blog findBlog = getFirstBlogOfUser(userId);

        validationBlogOwner(userId,findBlog.getUser().getId());

        blogRepository.delete(findBlog);
    }

    private Blog getFirstBlogOfUser(Long userId) {
        User user = userService.findById(userId);
        List<Blog> blogList = user.getBlogList();
        if (blogList == null || blogList.isEmpty()) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND);
        }
        return blogList.get(0);
    }



    @Transactional
    //수정을 요청한 사람이, 블로그의 주인이 맞는지 확인
    public void validationBlogOwner(Long getBlogUserId, Long userId){
        if(!userId.equals(getBlogUserId)){
            throw new BusinessLogicException(ExceptionCode.USER_NOT_BLOG_OWNER);
        }
    }
    @Transactional
    //현재는 하나의 블로그만 만들 수 있다는 가정 하에 validation 검사
    //블로그가 존재하는지 확인
    public void validationBlog(Long userId) {
        Optional<Blog> blogOptional = blogRepository.findByUserId(userId);

        if (blogOptional.isPresent()) {
            throw new BusinessLogicException(ExceptionCode.ALREADY_HAS_BLOG);
        }
    }

    @Transactional
    //해당 블로그가 존재하는지 확인
    public Blog verifiedBlog(long blogId) {
        Optional<Blog> blog = blogRepository.findById(blogId);
        return blog.orElseThrow(() -> new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND));
    }

    public Long findUserIdByBlogId(Long blogId){
        return blogRepository.findUserIdByBlogId(blogId);
    }

    public Long findBlogIdByUserId(Long userId){
            return blogRepository.findBlogIdByUserId(userId);
    }

    public Long findBlogIdByUsername(String username) {
        // UserService를 통해 user 조회
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_FOUND);
        }

        // 해당 유저의 블로그 조회
        Blog blog = blogRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND));

        return blog.getId();
    }


    public BlogResponseDto getBlogInfo(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND));

        return new BlogResponseDto(blog);
    }





    }