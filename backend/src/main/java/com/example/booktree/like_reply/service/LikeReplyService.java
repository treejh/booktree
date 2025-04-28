package com.example.booktree.like_reply.service;

import com.example.booktree.like_reply.dto.LikeReplyDto;
import com.example.booktree.like_reply.entity.LikeReply;
import com.example.booktree.like_reply.repository.LikeReplyRepository;
import com.example.booktree.reply.entity.Reply;
import com.example.booktree.reply.repository.ReplyRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeReplyService {

    private final LikeReplyRepository likeReplyRepository;
    private final ReplyRepository replyRepository;
    private final TokenService tokenService;
    private final UserService userService;

    /**
     * 대댓글 좋아요 토글
     * - 요청 시 해당 대댓글에 대해 현재 로그인한 사용자가 좋아요한 상태이면, 좋아요를 삭제
     *   그렇지 않으면 좋아요를 생성하여 반환
     */
    @Transactional
    public LikeReplyDto.Response toggleLike(LikeReplyDto.Post dto) {
        Reply reply = replyRepository.findById(dto.getReplyId())
                .orElseThrow(() -> new RuntimeException("Reply not found with id: " + dto.getReplyId()));
        Long userId = tokenService.getIdFromToken();
        User user = userService.findById(userId);

        Optional<LikeReply> existing = likeReplyRepository.findByReply_IdAndUser_Id(reply.getId(), userId);
        if (existing.isPresent()) {
            likeReplyRepository.delete(existing.get());
        } else {
            LikeReply lr = LikeReply.builder().reply(reply).user(user).build();
            likeReplyRepository.save(lr);
        }

        // 최종 좋아요 수 계산
        long likeCount = likeReplyRepository.countByReply_Id(reply.getId());

        return new LikeReplyDto.Response(
                existing.map(LikeReply::getId).orElse(0L),
                reply.getId(),
                userId,
                likeCount
        );
    }
}
