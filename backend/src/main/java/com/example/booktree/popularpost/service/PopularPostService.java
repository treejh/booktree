package com.example.booktree.popularpost.service;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import com.example.booktree.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PopularPostService {

    private final StringRedisTemplate redisTemplate;
    private final PostService postService;
    private static final String REDIS_KEY = "popular:posts";

    // 게시글 조회 시 인기순위에 반영
    public void increasePopularity(Long postId) {
        redisTemplate.opsForZSet().incrementScore(REDIS_KEY, postId.toString(), 1);
        log.info("redis : " + redisTemplate.toString());
    }

    // 인기 게시글 TOP N 조회
    public List<Post> getPopularPosts(int limit) {
        Set<String> postIds = redisTemplate.opsForZSet()
                .reverseRange(REDIS_KEY, 0, limit - 1);

        if (postIds == null || postIds.isEmpty()) {
            throw new BusinessLogicException(ExceptionCode.VIEW_NOT_FOUNd);
        }

        // Redis에서 가져온 postId를 기반으로 DB에서 조회
        List<Long> ids = postIds.stream().map(Long::parseLong).collect(Collectors.toList());

        // 순서 보장을 안해줌
        List<Post> posts = postService.findAllById(ids);

        // 순서 보장을 위해 Redis에 있던 순서대로 정렬
        Map<Long, Post> postMap = posts.stream()
                .collect(Collectors.toMap(Post::getId, p -> p));

        return ids.stream().map(postMap::get).collect(Collectors.toList());
    }
}
