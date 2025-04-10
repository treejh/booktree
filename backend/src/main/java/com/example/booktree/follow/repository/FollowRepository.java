package com.example.booktree.follow.repository;

import com.example.booktree.follow.entity.Follow;
import com.example.booktree.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    List<Follow> findByFollower_Id(Long followerId);

    List<Follow> findByFollowed_Id(Long followedId);

    long countByFollowed_Id(Long followedId);

    long countByFollower_Id(Long followerId);

    void deleteByFollower_IdAndFollowed_Id(Long followerId, Long followedId);
}
