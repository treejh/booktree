package com.example.booktree.likecomment.repository;

import com.example.booktree.likecomment.entity.LikeComment;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeCommentRepository extends JpaRepository<LikeComment, Long> {
    Optional<LikeComment> findByComment_IdAndUser_Id(Long commentId, Long userId);
}
