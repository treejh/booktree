package com.example.booktree.reply.repository;

import com.example.booktree.reply.entity.Reply;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
    List<Reply> findByComment_Id(Long commentId);
}
