package com.example.booktree.popularpost.service;

import com.example.booktree.blog.entity.Blog;
import com.example.booktree.maincategory.entity.MainCategory;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.service.PostService;
import com.example.booktree.user.entity.User;
import io.swagger.v3.oas.annotations.Parameter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PopularPostServiceTest {
    @InjectMocks
    private PopularPostService popularPostService;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private PostService postService;

    @Mock
    private ZSetOperations<String, String> zSetOperations;

    @BeforeEach
    void setUp() {
//        MockitoAnnotations.openMocks(this);

        // Mocking opsForZSet() 메서드가 zSetOperations를 반환하도록 설정
        when(redisTemplate.opsForZSet()).thenReturn(zSetOperations);

        // reverseRange 메서드의 반환값 설정
        Set<String> mockPostIds = new HashSet<>(Arrays.asList("1", "2", "3"));
//        when(zSetOperations.reverseRange(anyString(), anyInt(), anyInt())).thenReturn(mockPostIds);
        when(zSetOperations.reverseRange(eq("popular:posts"), eq(0L), any(Long.class))).thenReturn(mockPostIds);
    }


    @Test
    void testGetPopularPosts() {


        MainCategory mainCategory = new MainCategory();
        mainCategory.setId(1L);
        mainCategory.setName("소설");

        User user = new User();
        user.setId(1L);
        user.setEmail("email@email.com");
        user.setPassword("password");

        Blog blog = new Blog();
        blog.setId(1L);
        blog.setUser(user);
        blog.setName("임시 블로그");

        Post post1 = new Post();
        post1.setId(1L);
        post1.setTitle("1등 게시글");
        post1.setContent("1등이다");
        post1.setMainCategory(mainCategory);
        post1.setUser(user);
        post1.setBlog(blog);
        post1.setView(1000L);

        Post post2 = new Post(); // 필요한 필드 세팅
        post2.setId(2L);
        post2.setTitle("2등 게시글");
        post2.setContent("2등이다");
        post2.setMainCategory(mainCategory);
        post2.setUser(user);
        post2.setBlog(blog);
        post2.setView(100L);

        Post post3 = new Post(); // 필요한 필드 세팅
        post3.setId(3L);
        post3.setTitle("3등 게시글");
        post3.setContent("3등이다");
        post3.setMainCategory(mainCategory);
        post3.setUser(user);
        post3.setBlog(blog);
        post3.setView(10L);

        when(postService.findAllById(anyList())).thenReturn(Arrays.asList(post1, post2, post3));

        // 테스트 실행
//        List<Post> popularPosts = popularPostService.getPopularPosts(3);

        // 결과 검증
//        assertEquals(3, popularPosts.size());
//        assertEquals(Arrays.asList(post1, post2, post3), popularPosts);
    }



}