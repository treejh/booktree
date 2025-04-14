package com.example.booktree.user.repository;

import com.example.booktree.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
<<<<<<< HEAD
    Optional<User> findByPassword(String password);
=======

>>>>>>> 65ad54096182ca34cf8c2e0479c8209f206d8c2e
}
