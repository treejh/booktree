package com.example.booktree.likepost.repository;

import com.example.booktree.likepost.entity.LikePost;
import com.example.booktree.post.entity.Post;
import com.example.booktree.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikePostRepository extends JpaRepository<LikePost, Long> {

    // 특정 유저가 특정 게시글에 좋아요를 눌렀는지 확인하고, 해당 좋아요 엔티티를 반환
    Optional<LikePost> findByUserAndPost(User user, Post post);
    Long countByPost(Post post);
    // 유저와 게시글로 좋아요 존재 여부 확인
    boolean existsByUserAndPost(User user, Post post);

    // 게시글에 좋아요를 누른 유저들의 목록 조회
    //List<User> findUsersByPost(Post post);
    @Query("SELECT lp.user FROM LikePost lp WHERE lp.post = :post")
    List<User> findUsersByPost(@Param("post") Post post);

    // 사용자가 좋아요를 누른 게시글 목록 가져오기
    @Query("SELECT lp.post FROM LikePost lp WHERE lp.user.id = :userId")
    Page<Post> findLikedPostsByUser(@Param("userId") Long userId, Pageable pageable);

    // 좋아요 상태 게시글 삭제
    @Modifying
    @Query("DELETE FROM LikePost lp WHERE lp.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);


}
