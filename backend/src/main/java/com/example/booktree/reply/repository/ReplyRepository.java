package com.example.booktree.reply.repository;

import com.example.booktree.reply.entity.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {

    // 특정 부모 댓글(comment)의 ID로 대댓글(Page) 조회
    Page<Reply> findByComment_Id(Long commentId, Pageable pageable);
}
