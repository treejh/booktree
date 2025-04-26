package com.example.booktree.post.service;

import com.example.booktree.LikePost.repository.LikePostRepository;
import com.example.booktree.blog.entity.Blog;

import com.example.booktree.blog.service.BlogService;
import com.example.booktree.category.entity.Category;
import com.example.booktree.category.repository.CategoryRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.follow.dto.response.AllFollowListResponseDto;
import com.example.booktree.follow.entity.Follow;
import com.example.booktree.follow.service.FollowService;
import com.example.booktree.maincategory.entity.MainCategory;
import com.example.booktree.maincategory.repository.MainCategoryRepository;
import com.example.booktree.maincategory.service.MainCategortService;
import com.example.booktree.post.dto.request.PostRequestDto;
import com.example.booktree.post.dto.response.PostResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.user.service.UserService;
//import jakarta.transaction.Transactional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;



import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.example.booktree.image.entity.Image;
import com.example.booktree.image.repository.ImageRepository;
import com.example.booktree.utils.S3Uploader;
import org.springframework.transaction.annotation.Propagation;


@Service
@RequiredArgsConstructor
public class PostService {

    private final S3Uploader s3Uploader;

    private final PostRepository postRepository;
    private final MainCategortService mainCategortService;
    private final CategoryRepository categoryRepository;
    private final MainCategoryRepository mainCategoryRepository;
    private final ImageRepository imageRepository;
    private final LikePostRepository likePostRepository;

    private final TokenService tokenService;
    private final UserService userService;
    private final BlogService blogService;
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

        if (!blog.getUser().getId().equals(user.getId())) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_OWNER);
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

        if (!post.getBlog().getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_OWNER);
        }




        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setAuthor(dto.getAuthor());
        post.setBook(dto.getBook());
        post.setModifiedAt(LocalDateTime.now());

        // mainCategoryId 수정
        if (dto.getMainCategoryId() != null) {
            MainCategory mainCategory = mainCategoryRepository.findById(dto.getMainCategoryId())
                    .orElseThrow(() -> new BusinessLogicException(ExceptionCode.MAIN_CATEGORY_NOT_FOUND));
            post.setMainCategory(mainCategory);
        }

// categoryId 수정
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new BusinessLogicException(ExceptionCode.CATEGORY_NOT_FOUND));
            post.setCategory(category);
        }




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
    public void postViewUpdate(Long postId) {
        Post updatePost = findPostById(postId);
        updatePost.setView(updatePost.getView() + 1);
        postRepository.save(updatePost);
    }

    @Transactional
    public void deletePost(Long postId) {
        Long userId = tokenService.getIdFromToken();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

        if (!post.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_POST_OWNER);
        }

        if (!post.getBlog().getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_OWNER);
        }

        for (Image image : post.getImageList()) {
            s3Uploader.deleteFile(image.getImageUrl());
        }

        imageRepository.deleteAll(post.getImageList());
        postRepository.delete(post);
    }

    // 검색 기능 : searchType은 title, author, book 중 하나 선택, 전체 검색도 추가
    public Page<Post> searchPosts(String searchType, String keyword, Pageable pageable) {
        switch (searchType.toLowerCase()) {
            case "title":
                return postRepository.findByTitleContainingIgnoreCase(keyword, pageable);
            case "author":
                return postRepository.findByAuthorContainingIgnoreCase(keyword, pageable);
            case "book":
                return postRepository.findByBookContainingIgnoreCase(keyword, pageable);
            case "all":
                return postRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable);
            default:
                throw new BusinessLogicException(ExceptionCode.INVALID_SEARCH_TYPE);
        }
    }

    public Page<Post> searchAll(String keyword, Pageable pageable) {
        return postRepository.searchAll(keyword, pageable);
    }

    //팔로잉 한 유저들의 게시글을 최신순으로 가져오기
    @Transactional
    public Page<Post> getPostsFromFollowing(Pageable pageable){

        //id가 userid인듯( 내가 팔로잉한 사람들 )
        List<Long> followingList = followService.followingList();


        if (followingList.isEmpty()) {
            System.out.println("여기 들어오나?");
            return Page.empty(pageable);
        }
        return postRepository.findByUserIdInOrderByCreatedAtDesc(followingList, pageable);
    }

    //사용자가 좋아요 누른 게시글 가져오기
    @Transactional
    public Page<Post> getPostsFromUserLike(Pageable pageable){
        Long userId = tokenService.getIdFromToken();
        Page<Post> likePostList = likePostRepository.findLikedPostsByUser(userId,pageable);

        if (likePostList.isEmpty()) {
            return Page.empty(pageable);
        }

        return likePostList;

    }

    // 게시글 좋아요에 service주입용 추가
    public Post findById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
    }

    @Transactional//(propagation = Propagation.REQUIRES_NEW)
    public void increaseViewCount(Post post) {
        post.setView(post.getView() + 1);
        //postRepository.save(post);
    }


    // 게시글 아이디로 해당 게시글 조회 (조회수 증가)
    @Transactional
    public Post findPostById(Long postId) {

        System.out.println("🔥🔥 게시글 조회 서비스 실행됨");

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

        post.setView(post.getView() + 1); // 영속성 상태에서 직접 수정

        return post;
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


    // 최신순
    public Page<PostResponseDto> getPagedPostsByBlog(Long blogId, int page, int size) {

        if (blogId == null) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND);
        }

        Blog blog = blogService.findBlogByBlogId(blogId);
        if (blog == null) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByBlogIdOrderByCreatedAtDesc(blogId, pageable);

        List<Post> debugList = postRepository.findByBlogId(2L);


        return posts.map(post -> PostResponseDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .viewCount(post.getView())
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .build());
    }

    public Page<PostResponseDto> getPopularWeekPostsByBlog(Long blogId, int page, int size) {
        Blog blog = blogService.findBlogByBlogId(blogId);
        if (blog == null) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND);
        }

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Pageable pageable = PageRequest.of(page, size);

        Page<Post> posts = postRepository.findPopularPostsByLikesInLastWeek(blogId, oneWeekAgo, pageable);

        //List<Post> debugList = postRepository.findByBlogId(2L);



        return posts.map(post -> PostResponseDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .viewCount(post.getView())
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .build());
    }



    public List<Post> findAllById(List<Long> allId){
        return postRepository.findAllById(allId);
    }


    public Page<PostResponseDto> getPopularPostsByBlog(Long blogId, int page, int size) {
        Blog blog = blogService.findBlogByBlogId(blogId);
        if (blog == null) {
            throw new BusinessLogicException(ExceptionCode.BLOG_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findPopularPostsByBlogId(blogId, pageable);

        return posts.map(post -> PostResponseDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .viewCount(post.getView())
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .build());
    }

    public Long findUserId(Long postId){

        Long userId = postRepository.findUserIdByPostId(postId);
        if (userId == null) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_FOUND);
        }
        return userId;
    }


}
