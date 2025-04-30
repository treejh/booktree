
package com.example.booktree.popularpost.service;


import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.post.dto.response.PostResponseDto;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.example.booktree.utils.ImageUtil.DEFAULT_POST_IMAGE;

@Service
@RequiredArgsConstructor
@Slf4j
public class PopularPostService {

    private final StringRedisTemplate redisTemplate;
    private static final String REDIS_KEY = "popular:posts:";
    private final String defaultImageUrl = DEFAULT_POST_IMAGE;
    private final PostRepository postRepository;


    // 메인 카테고리 별 게시글 조회 시 인기순위에 반영
    public void increasePopularity(Long postId, Long mainCategoryId) {
        String key = getMonthlyKey(mainCategoryId);
        redisTemplate.opsForZSet().incrementScore(key, postId.toString(), 1);
    }


    // 메인 카테고리 별 인기 게시글 TOP N 조회
// 메인 카테고리 별 인기 게시글 TOP N 조회
    public List<PostResponseDto> getPopularPosts(int limit, Long mainCategoryId) {
        String key = getMonthlyKey(mainCategoryId);

        Set<ZSetOperations.TypedTuple<String>> postScores = redisTemplate.opsForZSet()
                .reverseRangeWithScores(key, 0, limit - 1);

        log.info("postScore : " + postScores.toString());


        if (postScores == null || postScores.isEmpty()) {
            throw new BusinessLogicException(ExceptionCode.VIEW_NOT_FOUND);
        }

        // Redis에서 가져온 postId와 score를 기반으로 DB에서 조회
        List<Long> ids = new ArrayList<>();

        List<Double> scores = new ArrayList<>(); // score를 저장할 리스트 추가

        for (ZSetOperations.TypedTuple<String> tuple : postScores) {
            String postId = tuple.getValue();
            Double score = tuple.getScore();
            log.info("Post ID: {}, Score: {}", postId, score); // score 출력
            ids.add(Long.parseLong(postId));


            scores.add(score); // score 리스트에 추가

        }

        // 순서 보장을 안해줌
        List<Post> posts = postRepository.findAllByIdWithImages(ids);

        // 순서 보장을 위해 Redis에 있던 순서대로 정렬
        Map<Long, Post> postMap = posts.stream()
                .collect(Collectors.toMap(Post::getId, p -> p));

        // PostResponseDto 리스트 생성 (score 포함)
        List<PostResponseDto> response = ids.stream()
                .map(id -> {
                    Post post = postMap.get(id);
                    if(post.getImageList().size()>0){
                        //System.out.println("imageUrl : " + post.getImageList().get(0).getImageUrl());
                    }

                    double score = scores.get(ids.indexOf(id)); // score 가져오기
                    return PostResponseDto.builder()
                            .postId(post.getId())
                            .title(post.getTitle())
                            .imageUrl(post.getImageList().isEmpty() ? defaultImageUrl : post.getImageList().get(0).getImageUrl())
                            .viewCount(post.getView())
                            .score(score) // score 설정
                            .createdAt(post.getCreatedAt())
                            .modifiedAt(post.getModifiedAt())
                            .build();
                })
                .collect(Collectors.toList());

        return response; // PostResponseDto 리스트 반환
    }


    // 현재 날짜에 따라 월별 키 생성
    private String getMonthlyKey(Long mainCategoryId) {
        LocalDate now = LocalDate.now();
        String monthKey = now.format(DateTimeFormatter.ofPattern("yyyy-MM"));
        return REDIS_KEY + mainCategoryId + ":month:" + monthKey;
    }


    // 게시글 삭제 시 Redis 인기 데이터 삭제
    public void removePostFromPopularity(Long postId, Long mainCategoryId) {
        String key = getMonthlyKey(mainCategoryId);
        // ZREM 명령어 사용: 지정된 Sorted Set에서 멤버 제거
        Long removedCount = redisTemplate.opsForZSet().remove(key, postId.toString());
        if (removedCount != null && removedCount > 0) {
            log.info("Removed post {} from Redis popular list key: {}", postId, key);
        } else {
            log.warn("Post {} not found in Redis popular list key: {}", postId, key);
        }
    }
}

