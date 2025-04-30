package com.example.booktree.reply.repository;

import com.example.booktree.reply.entity.Reply;
import com.example.booktree.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {

    // 특정 부모 댓글(comment)의 ID로 대댓글(Page) 조회
    Page<Reply> findByComment_Id(Long commentId, Pageable pageable);

    @Modifying
    @Query("DELETE FROM Reply r WHERE r.comment.user = :user")
    void deleteByCommentUser(@Param("user") User user);

    @Transactional
    @Modifying
    @Query("DELETE FROM Reply f WHERE f.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Reply r WHERE r.comment IN (SELECT c FROM Comment c WHERE c.post.user = :user)")
    void deleteByCommentPostUser(@Param("user") User user);


}
