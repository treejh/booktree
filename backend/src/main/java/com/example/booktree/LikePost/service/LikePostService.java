package com.example.booktree.LikePost.service;

import com.example.booktree.LikePost.entity.LikePost;
import com.example.booktree.LikePost.repository.LikePostRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.service.PostService;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.TokenService;
import com.example.booktree.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikePostService {

    private final LikePostRepository likePostRepository;
    private final UserService userService;
    private final PostService postService;
    private final TokenService tokenService;

    /**
     * 게시글 좋아요
     *
     *
     * - 게시글 좋아요 CRUD
     *     - 게시글의 좋아요 개수 가지고오기
     *     - 게시글 가지고 올때 테이블에 넣기 실시간으로 계산에서 넣기
     *     - 좋아요 개수 가지고 오는 api 생성
     */


    @Transactional
    public void likePost(Long postId) {
        Long userId = tokenService.getIdFromToken(); // 토큰에서 유저 ID 추출
        User user = userService.findById(userId);   // 유저 조회
        Post post = postService.findById(postId);   // 게시글 조회

        // 이미 좋아요 했는지 체크
        if (likePostRepository.existsByUserAndPost(user, post)) {
            throw new BusinessLogicException(ExceptionCode.ALREADY_LIKED);
        }

        // 게시글 좋아요 수 +1
        post.setLikeCount(post.getLikeCount() + 1);

        // 좋아요 객체 저장
        LikePost likePost = LikePost.builder()
                .user(user)
                .post(post)
                .build();
        likePostRepository.save(likePost);
    }

    /**
     * 게시글 좋아요 취소
     */
    @Transactional
    public void unlikePost(Long postId) {
        Long userId = tokenService.getIdFromToken();
        User user = userService.findById(userId);
        Post post = postService.findById(postId);

        LikePost likePost = likePostRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.LIKE_NOT_FOUND));

        // 게시글 좋아요 수 -1 (0 이하로는 내려가지 않게)
        post.setLikeCount(Math.max(0, post.getLikeCount() - 1));

        likePostRepository.delete(likePost);
    }

    /**
     * 현재 게시글 좋아요 수 조회
     */
    @Transactional
    public int getLikeCount(Long postId) {
        Post post = postService.findById(postId);
        return post.getLikeCount().intValue();
    }

    /**
     * 현재 로그인한 유저가 해당 게시글에 좋아요 했는지 여부 확인
     */
    public boolean hasLikedPost(Long postId) {
        Long userId = tokenService.getIdFromToken();
        User user = userService.findById(userId);
        Post post = postService.findById(postId);
        return likePostRepository.existsByUserAndPost(user, post);
    }
}
