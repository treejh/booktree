package com.example.booktree.follow.controller;

import com.example.booktree.follow.dto.request.FollowRequestDto;
import com.example.booktree.follow.dto.request.UnFollowRequestDto;
import com.example.booktree.follow.dto.response.AllFollowListResponseDto;
import com.example.booktree.follow.dto.response.FollowCountDto;
import com.example.booktree.follow.service.FollowService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/follow")
@RequiredArgsConstructor
@Tag(name = "팔로우 관리 컨트롤러")
public class FollowController {

    private final FollowService followService;

    // 팔로우 모두 보기
    @GetMapping("/allfollower/{userId}")
    public ResponseEntity<?> allFollow(@PathVariable Long userId) {

        List<AllFollowListResponseDto> response = followService.getAllFollowerList(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 팔로잉 모두 보기
    @GetMapping("/allfollowed/{userId}")
    public ResponseEntity<?> allFollowed(@PathVariable Long userId) {

        List<AllFollowListResponseDto> response = followService.getAllFollowedList(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 팔로우 생성
    @PostMapping("/createfollow")
    public ResponseEntity<?> createFollow(@RequestBody FollowRequestDto followRequestDto){

        followService.createFollow(followRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 팔로워, 팔로잉 숫자
    @GetMapping("/getfollwcount/{userId}")
    public ResponseEntity<?> getFollowCount(@PathVariable Long userId) {

        FollowCountDto response = followService.getCount(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 언팔로우
    @DeleteMapping("/unfollow")
    public ResponseEntity<?> unfollow(@RequestBody UnFollowRequestDto unFollowRequestDto) {

        followService.unFollow(unFollowRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
