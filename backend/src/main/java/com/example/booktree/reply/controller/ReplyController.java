package com.example.booktree.reply.controller;

import com.example.booktree.reply.dto.ReplyDto;
import com.example.booktree.reply.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/replies")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;

    // 대댓글 생성 : /api/v1/replies/create
    @PostMapping("/create")
    public ResponseEntity<ReplyDto.Response> createReply(@RequestBody ReplyDto.Post dto) {
        ReplyDto.Response response = replyService.createReply(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 대댓글 조회 : /api/v1/replies/get?commentId={commentId}&page={page}&size={size}
    @GetMapping("/get")
    public ResponseEntity<Page<ReplyDto.Response>> getReplies(
            @RequestParam("commentId") Long commentId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<ReplyDto.Response> response = replyService.getRepliesByCommentId(commentId, pageRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 대댓글 수정 :  /api/v1/replies/update/{replyId}
    @PatchMapping("/update/{replyId}")
    public ResponseEntity<ReplyDto.Response> updateReply(@PathVariable Long replyId,
                                                         @RequestBody ReplyDto.Patch dto) {
        dto.setReplyId(replyId);
        ReplyDto.Response response = replyService.updateReply(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 대댓글 삭제 : DELETE /api/v1/replies/delete/{replyId}
    @DeleteMapping("/delete/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long replyId) {
        replyService.deleteReply(replyId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
