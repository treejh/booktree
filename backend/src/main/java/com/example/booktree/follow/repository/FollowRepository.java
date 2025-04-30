package com.example.booktree.follow.repository;

import com.example.booktree.follow.entity.Follow;
import com.example.booktree.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    List<Follow> findByFollower_Id(Long followerId);

    List<Follow> findByFollowed_Id(Long followedId);

    long countByFollowed_Id(Long followedId);

    long countByFollower_Id(Long followerId);

    void deleteByFollower_IdAndFollowed_Id(Long followerId, Long followedId);

    Optional<Follow> findByFollowerAndFollowed(User follower, User followed);

    @Transactional
    @Modifying
    @Query("DELETE FROM Follow f WHERE f.follower = :user")
    void deleteByFollower(@Param("user") User user);

    @Transactional
    @Modifying
    @Query("DELETE FROM Follow f WHERE f.followed = :user")
    void deleteByFollowed(@Param("user") User user);


}
