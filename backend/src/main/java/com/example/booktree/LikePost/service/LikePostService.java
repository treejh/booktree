package com.example.booktree.likepost.service;

import com.example.booktree.likepost.entity.LikePost;
import com.example.booktree.likepost.repository.LikePostRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.service.PostService;
import com.example.booktree.user.entity.User;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LikePostService {

    private final LikePostRepository likePostRepository;
    private final UserService userService;
    private final PostService postService;
    private final TokenService tokenService;




    @Transactional
    public void likePost(Long postId) {
        Long userId = tokenService.getIdFromToken(); // 토큰에서 유저 아이디를 추출
        User user = userService.findById(userId);   // 유저 조회
        Post post = postService.findById(postId);   // 게시글 조회

        // 로그인 상태가 아닐 때
        if (userId == null) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_LOGGED_IN);
        }


        // 게시글 작성자가 현재 로그인한 유저와 동일한지 체크
        if (post.getUser().equals(user)) {
            throw new BusinessLogicException(ExceptionCode.CANNOT_LIKE_OWN_POST);
        }

        // 좋아요를 눌렀는데 해당 게시물이 존재하지 않을 때
        // 예를 들자면 방금 삭제된 글이 아직 웹 페이지에는 그 삭제동작이 적용되지 않아서 아직 나타나는 중인 상태라 가정했을 때
        // 그페이지에서  좋아요를 눌렀을 시
        if (post == null) {
            throw new BusinessLogicException(ExceptionCode.POST_NOT_FOUND);
        }


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


    @Transactional
    public int getLikeCount(Long postId) {
        Post post = postService.findById(postId);
        return post.getLikeCount() != null ? post.getLikeCount().intValue() : 0;
        //return post.getLikeCount() == null ? 0 : post.getLikeCount().intValue();
    }


    public boolean hasLikedPost(Long postId) {
        Long userId = tokenService.getIdFromToken();
        User user = userService.findById(userId);
        Post post = postService.findById(postId);
        return likePostRepository.existsByUserAndPost(user, post);
    }


    // 좋아요를 누른 유저들의 목록을 조회
    @Transactional
    public List<User> getUsersWhoLikedPost(Long postId) {
        Post post = postService.findById(postId);
        return likePostRepository.findUsersByPost(post);
    }


}
