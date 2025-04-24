package com.example.booktree.user.repository;

import com.example.booktree.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByPassword(String password);
    Optional<User> findByRefreshToken(String refreshToken);
    Optional<User> findBySocialIdAndSsoProvider(String socialId, String ssoProvider);
    Optional<User> findByEmailAndPhoneNumber(String email, String phoneNumber);



}
