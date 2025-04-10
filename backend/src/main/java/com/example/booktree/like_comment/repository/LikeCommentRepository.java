package com.example.booktree.like_comment.repository;

import com.example.booktree.like_comment.entity.LikeComment;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeCommentRepository extends JpaRepository<LikeComment, Long> {
    Optional<LikeComment> findByComment_IdAndUser_Id(Long commentId, Long userId);
}
