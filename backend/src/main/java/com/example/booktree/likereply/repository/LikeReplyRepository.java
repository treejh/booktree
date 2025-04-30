package com.example.booktree.likereply.repository;

import com.example.booktree.likereply.entity.LikeReply;
import com.example.booktree.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface LikeReplyRepository extends JpaRepository<LikeReply, Long> {
    Optional<LikeReply> findByReply_IdAndUser_Id(Long replyId, Long userId);
    long countByReply_Id(Long replyId);

    @Transactional
    @Modifying
    @Query("DELETE FROM LikeReply f WHERE f.user = :user")
    void deleteByUser(@Param("user") User user);



    @Modifying
    @Query("DELETE FROM LikeReply lr WHERE lr.reply IN (SELECT r FROM Reply r WHERE r.user = :user)")
    void deleteByReplyUser(@Param("user") User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM LikeReply lr WHERE lr.reply IN (SELECT r FROM Reply r WHERE r.comment.post.user = :user)")
    void deleteByReplyCommentPostUser(@Param("user") User user);



}
