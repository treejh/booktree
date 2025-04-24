//package com.example.booktree.popularpost.service;
//
//import com.example.booktree.exception.BusinessLogicException;
//import com.example.booktree.exception.ExceptionCode;
//import com.example.booktree.post.entity.Post;
//import com.example.booktree.post.repository.PostRepository;
//import com.example.booktree.post.service.PostService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.redis.core.StringRedisTemplate;
//import org.springframework.data.redis.core.ZSetOperations;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class PopularPostService {
//
//    private final StringRedisTemplate redisTemplate;
//    private final PostService postService;
//    private static final String REDIS_KEY = "popular:posts";
//
//    // 게시글 조회 시 인기순위에 반영
//    public void increasePopularity(Long postId) {
//        redisTemplate.opsForZSet().incrementScore(REDIS_KEY, postId.toString(), 1);
//    }
//
//    // 인기 게시글 TOP N 조회
//    public List<Post> getPopularPosts(int limit) {
//        Set<ZSetOperations.TypedTuple<String>> postScores = redisTemplate.opsForZSet()
//                .reverseRangeWithScores(REDIS_KEY, 0, limit - 1);
//
//        if (postScores == null || postScores.isEmpty()) {
//            throw new BusinessLogicException(ExceptionCode.VIEW_NOT_FOUND);
//        }
//
//        // Redis에서 가져온 postId와 score를 기반으로 DB에서 조회
//        List<Long> ids = new ArrayList<>();
//        for (ZSetOperations.TypedTuple<String> tuple : postScores) {
//            String postId = tuple.getValue();
//            Double score = tuple.getScore();
//            log.info("Post ID: {}, Score: {}", postId, score); // score 출력
//            ids.add(Long.parseLong(postId));
//        }
//
//        // 순서 보장을 안해줌
//        List<Post> posts = postService.findAllById(ids);
//
//        // 순서 보장을 위해 Redis에 있던 순서대로 정렬
//        Map<Long, Post> postMap = posts.stream()
//                .collect(Collectors.toMap(Post::getId, p -> p));
//
//        return ids.stream().map(postMap::get).collect(Collectors.toList());
//    }
//}
