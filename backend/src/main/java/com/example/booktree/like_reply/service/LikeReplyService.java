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

        String userEmail = tokenService.getEmailFromToken();
        User user = userService.findUserByEmail(userEmail);

        Optional<LikeReply> existingLike = likeReplyRepository.findByReply_IdAndUser_Id(dto.getReplyId(), user.getId());
        if (existingLike.isPresent()) {
            likeReplyRepository.delete(existingLike.get());
            return new LikeReplyDto.Response(0L, reply.getId(), user.getId());
        } else {
            LikeReply likeReply = LikeReply.builder()
                    .reply(reply)
                    .user(user)
                    .build();
            LikeReply saved = likeReplyRepository.save(likeReply);
            return new LikeReplyDto.Response(saved.getId(), reply.getId(), user.getId());
        }
    }
}
