package com.example.booktree.likecomment.repository;

import com.example.booktree.likecomment.entity.LikeComment;
import com.example.booktree.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface LikeCommentRepository extends JpaRepository<LikeComment, Long> {
    Optional<LikeComment> findByComment_IdAndUser_Id(Long commentId, Long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM LikeComment f WHERE f.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM LikeComment lc WHERE lc.comment.user = :user")
    void deleteByCommentUser(@Param("user") User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM LikeComment lc WHERE lc.comment IN (SELECT c FROM Comment c WHERE c.post.user = :user)")
    void deleteByCommentPostUser(@Param("user") User user);


}
