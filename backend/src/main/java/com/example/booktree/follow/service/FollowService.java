package com.example.booktree.follow.service;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.follow.dto.request.FollowRequestDto;
import com.example.booktree.follow.dto.request.UnFollowRequestDto;
import com.example.booktree.follow.dto.response.AllFollowListResponseDto;
import com.example.booktree.follow.dto.response.FollowCountDto;
import com.example.booktree.follow.entity.Follow;
import com.example.booktree.follow.repository.FollowRepository;
import com.example.booktree.user.entity.User;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class FollowService {

    public final FollowRepository followRepository;
    public final UserService userService;
    private final TokenService tokenService;

    // 모든 팔로우 정보 제공
    @Transactional(readOnly = true)
    public List<AllFollowListResponseDto> getAllFollowerList() {

        Long userId = tokenService.getIdFromToken();
        List<Follow> follows = followRepository.findByFollower_Id(userId);

        return IntStream.range(0, follows.size())
                .mapToObj(index -> {
                    Follow follower = follows.get(index);
                    return AllFollowListResponseDto.builder()
                            .id(follower.getId())
                            .count(index + 1)
                            .userId(follower.getFollowed().getId())
                            .username(follower.getFollowed().getUsername())
                            .create_at(follower.getCreatedAt())
                            .update_at(follower.getModifiedAt())
                            .build();
                })
                .toList();
    }

    // 모든 팔로잉 정보 제공
    @Transactional(readOnly = true)
    public List<AllFollowListResponseDto> getAllFollowedList() {

        Long userId = tokenService.getIdFromToken();

        List<Follow> follows = followRepository.findByFollowed_Id(userId);

        return IntStream.range(0, follows.size())
                .mapToObj(index -> {
                    Follow followed = follows.get(index);
                    return AllFollowListResponseDto.builder()
                            .id(followed.getId())
                            .count(index + 1)
                            .userId(followed.getFollower().getId())
                            .username(followed.getFollower().getUsername())
                            .create_at(followed.getCreatedAt())
                            .update_at(followed.getModifiedAt())
                            .build();
                })
                .toList();
    }


    // create
    @Transactional
    public void createFollow(FollowRequestDto followRequestDto) {

        Long userId = tokenService.getIdFromToken();

        User follower = userService.findById(userId);
        User followed = userService.findById(followRequestDto.getFolloweeId());

        if(follower.equals(followed)) {
            throw new BusinessLogicException(ExceptionCode.SELF_FOLLOW);
        }

        if (isIn(userId,followRequestDto.getFolloweeId())) {
            throw new BusinessLogicException(ExceptionCode.ALREADY_FOLLOW);
        }

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
    public FollowCountDto getCount() {
        Long userId = tokenService.getIdFromToken();

        FollowCountDto followCountDto = new FollowCountDto();

        followCountDto.setFollowerCount(getFollowerCount(userId));
        followCountDto.setFollowingCount(getFollowingCount(userId));
        return followCountDto;
    }

    // 언팔로우
    @Transactional
    public void unFollow(UnFollowRequestDto unFollowRequestDto) {
        Long userId = tokenService.getIdFromToken();
        if(isIn(userId, unFollowRequestDto.getFolloweeId())) {
            followRepository.deleteByFollower_IdAndFollowed_Id(userId, unFollowRequestDto.getFolloweeId());
        }else{
            throw new BusinessLogicException(ExceptionCode.FOLLOW_NOT_FOUND);
        }
    }

    public boolean isIn(Long followerId, Long followedId){

        User follower = userService.findById(followerId);
        User followed = userService.findById(followedId);

        Optional<Follow> existingFollow = followRepository.findByFollowerAndFollowed(follower, followed);
        if (existingFollow.isPresent()) {
            return true;
        }else{
            return false;
        }
    }

    //팔로우 엔티티에서 본인이 팔로우한 아이디 빼오기
    public List<Long> followingList(){
        List<Follow> followingList = followRepository.findByFollower_Id(tokenService.getIdFromToken());
        return followingList.stream()
                .map(follow ->follow.getFollowed().getId())  // 상대방 ID
                .toList();

    }


}
