package com.example.booktree.post.service;

import com.example.booktree.blog.entity.Blog;

import com.example.booktree.blog.service.BlogService;
import com.example.booktree.category.entity.Category;
import com.example.booktree.category.repository.CategoryRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.follow.dto.response.AllFollowListResponseDto;
import com.example.booktree.follow.service.FollowService;
import com.example.booktree.maincategory.entity.MainCategory;
import com.example.booktree.maincategory.repository.MainCategoryRepository;
import com.example.booktree.maincategory.service.MainCategortService;
import com.example.booktree.post.dto.request.PostRequestDto;
import com.example.booktree.post.dto.response.PostResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.TokenService;
import com.example.booktree.user.service.UserService;
import jakarta.transaction.Transactional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.example.booktree.image.entity.Image;
import com.example.booktree.image.repository.ImageRepository;
import com.example.booktree.utils.S3Uploader;


@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final S3Uploader s3Uploader;
    private final PostRepository postRepository;
    private final MainCategortService mainCategortService;
    private final TokenService tokenService;
    private final UserService userService;
    private final BlogService blogService;
    private final CategoryRepository categoryRepository;
    private final MainCategoryRepository mainCategoryRepository;
    private final ImageRepository imageRepository;
    private final FollowService followService;



    public List<Post> getPostByCategory(Long categoryId) {
        return postRepository.findByCategoryId(categoryId);
    }


    // 메인 카테고리별 최신순 게시글 가져오기
    public Page<Post> getPost(Pageable pageable, Long mainCategoryId) {
        // 메인 카테고리가 없을 시 예외처리
        if(!mainCategortService.validateMainCate(mainCategoryId)){
            throw new BusinessLogicException(ExceptionCode.MAINCATEGORY_NOT_FOUNT);
        }

        return postRepository.findByMainCategoryId(mainCategoryId, pageable);
    }

    // 메인 카테고리 별 일주일 동안 조회수 높은 게시글 가져오기
    public Page<Post> getPostByViews(Pageable pageable, Long mainCategoryId) {
        // 메인 카테고리가 없을 시 예외처리
        if (!mainCategortService.validateMainCate(mainCategoryId)) {
            throw new BusinessLogicException(ExceptionCode.MAINCATEGORY_NOT_FOUNT);
        }

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return postRepository.findTopPostsByViewsInLastWeek(mainCategoryId, oneWeekAgo, pageable);
    }



    @Transactional
    public void createPost(PostRequestDto dto) {

        Long userId = tokenService.getIdFromToken();
        User user = userService.findById(userId);
        Blog blog = blogService.findBlogByBlogId(dto.getBlogId());

        MainCategory mainCategory = mainCategoryRepository.findById(dto.getMainCategoryId())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.MAINCATEGORY_NOT_FOUNT));

        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new BusinessLogicException(ExceptionCode.CATEGORY_NOT_FOUND));
        }

        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(dto.getAuthor())
                .book(dto.getBook())
                .user(user)
                .blog(blog)
                .mainCategory(mainCategory)
                .category(category)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        postRepository.save(post);

        // 이미지 업로드
        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            List<String> uploadedImageUrls = s3Uploader.autoImagesUploadAndDelete(new ArrayList<>(), dto.getImages());

            for (String imageUrl : uploadedImageUrls) {
                Image image = new Image();
                image.setPost(post);
                image.setImageUrl(imageUrl);
                imageRepository.save(image); // 이미지 저장
            }
        }
    }


    @Transactional
    public void updatePost(Long postId, PostRequestDto dto) {
        Long userId = tokenService.getIdFromToken();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

        if (!post.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_POST_OWNER);
        }

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setAuthor(dto.getAuthor());
        post.setBook(dto.getBook());
        post.setModifiedAt(LocalDateTime.now());

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            List<String> currentImageUrls = new ArrayList<>();
            for (Image image : post.getImageList()) {
                currentImageUrls.add(image.getImageUrl());
            }

            List<String> uploadedImageUrls = s3Uploader.autoImagesUploadAndDelete(currentImageUrls, dto.getImages());


            imageRepository.deleteAll(post.getImageList());
            post.getImageList().clear();


            for (String imageUrl : uploadedImageUrls) {
                Image newImage = new Image();
                newImage.setPost(post);
                newImage.setImageUrl(imageUrl);
                imageRepository.save(newImage); // 새 이미지 저장
            }
        }

    }

    @Transactional
    public void deletePost(Long postId) {
        Long userId = tokenService.getIdFromToken();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

        if (!post.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_POST_OWNER);
        }

        for (Image image : post.getImageList()) {
            s3Uploader.deleteFile(image.getImageUrl());
        }

        imageRepository.deleteAll(post.getImageList());
        postRepository.delete(post);
    }

    @Transactional
    public Page<Post> getPostsFromFollowing(){
        Long userId = tokenService.getIdFromToken();

        Pageable pageable = PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "createdAt"));


        //id가 userid인듯
        List<AllFollowListResponseDto> followingList = followService.getAllFollowedList(userId);
        List<Long> followingUserIds = followingList.stream()
                .map(AllFollowListResponseDto::getId)
                .toList();

        if (followingUserIds.isEmpty()) {
            return Page.empty(pageable);
        }

        return postRepository.findByUserIdInOrderByCreatedAtDesc(followingUserIds, pageable);

    }



    // 게시글 좋아요에 service주입용 추가
    public Post findById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
    }



    // 게시글 아이디로 해당 게시글 조회
    public Post findPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
    }

    // 블로그별로 게시글 목록 조회
    public List<PostResponseDto> getPostsByBlog(Long blogId) {
        Blog blog = blogService.findBlogByBlogId(blogId);
        if (blog == null) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND);
        }

        List<Post> posts = postRepository.findByBlogId(blogId);

        List<PostResponseDto> response = new ArrayList<>();
        for (Post post : posts) {
            response.add(PostResponseDto.builder()
                    .postId(post.getId())
                    .title(post.getTitle())
                    .viewCount(post.getView())
                    .createdAt(post.getCreatedAt())
                    .modifiedAt(post.getModifiedAt())
                    .build());
        }
        return response;
    }

    // 회원별로 게시글 목록을 조회
    public List<PostResponseDto> getPostsByUser(Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_FOUND);
        }

        List<Post> posts = postRepository.findByUserId(userId);

        List<PostResponseDto> response = new ArrayList<>();
        for (Post post : posts) {
            response.add(PostResponseDto.builder()
                    .postId(post.getId())
                    .title(post.getTitle())
                    .viewCount(post.getView())
                    .createdAt(post.getCreatedAt())
                    .modifiedAt(post.getModifiedAt())
                    .build());
        }
        return response;
    }

    public List<Post> findAllById(List<Long> allId){
        return postRepository.findAllById(allId);
    }
}
