package com.example.booktree.likereply.repository;

import com.example.booktree.likereply.entity.LikeReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LikeReplyRepository extends JpaRepository<LikeReply, Long> {
    Optional<LikeReply> findByReply_IdAndUser_Id(Long replyId, Long userId);
    long countByReply_Id(Long replyId);
}
