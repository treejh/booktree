package com.example.booktree.follow.service;

import com.example.booktree.follow.dto.request.FollowRequestDto;
import com.example.booktree.follow.dto.request.UnFollowRequestDto;
import com.example.booktree.follow.dto.response.AllFollowListResponseDto;
import com.example.booktree.follow.dto.response.FollowCountDto;
import com.example.booktree.follow.entity.Follow;
import com.example.booktree.follow.repository.FollowRepository;
import com.example.booktree.maincategory.dto.response.AllMainCategoryResponseDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class FollowService {

    public final FollowRepository followRepository;
    public final UserService userService;

    // 모든 팔로우 정보 제공
    @Transactional(readOnly = true)
    public List<AllFollowListResponseDto> getAllFollowerList(Long userId) {

        List<Follow> follows = followRepository.findByFollower_Id(userId);

        return IntStream.range(0, follows.size())
                .mapToObj(index -> {
                    Follow follower = follows.get(index);
                    return AllFollowListResponseDto.builder()
                            .id(follower.getId())
                            .count(index + 1)
                            .username(follower.getFollower().getUsername())
                            .create_at(follower.getCreatedAt())
                            .update_at(follower.getModifiedAt())
                            .build();
                })
                .toList();
    }

    // 모든 팔로잉 정보 제공
    @Transactional(readOnly = true)
    public List<AllFollowListResponseDto> getAllFollowedList(Long userId) {

        List<Follow> follows = followRepository.findByFollowed_Id(userId);

        return IntStream.range(0, follows.size())
                .mapToObj(index -> {
                    Follow followed = follows.get(index);
                    return AllFollowListResponseDto.builder()
                            .id(followed.getId())
                            .count(index + 1)
                            .username(followed.getFollower().getUsername())
                            .create_at(followed.getCreatedAt())
                            .update_at(followed.getModifiedAt())
                            .build();
                })
                .toList();
    }


    // create
    public void createFollow(FollowRequestDto followRequestDto) {

        // 팔로워 팔로잉 설정
        User follower = userService.findById(followRequestDto.getFollowerId());
        User followed = userService.findById(followRequestDto.getFolloweeId());

        Follow follow = Follow.builder()
                .follower(follower)
                .followed(followed)
                .build();

        followRepository.save(follow);
    }

    // 팔로워 숫자 반환
    public long getFollowerCount(Long userId) {
        return followRepository.countByFollowed_Id(userId);
    }

    // 팔로잉 숫자 반환
    public long getFollowingCount(Long userId) {
        return followRepository.countByFollower_Id(userId);
    }

    // 팔로워, 팔로잉 수 dto 반환
    public FollowCountDto getCount(Long userId) {
        FollowCountDto followCountDto = new FollowCountDto();

        followCountDto.setFollowerCount(getFollowerCount(userId));
        followCountDto.setFollowingCount(getFollowingCount(userId));
        return followCountDto;
    }

    // 언팔로우
    @Transactional
    public void unFollow(UnFollowRequestDto unFollowRequestDto) {
        followRepository.deleteByFollower_IdAndFollowed_Id(unFollowRequestDto.getFollowerId(), unFollowRequestDto.getFolloweeId());
    }


}
