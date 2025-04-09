package com.example.booktree.user.service;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.user.dto.UserRegisterRequestDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.booktree.role.repository.RoleRepository;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Transactional
    public void register(UserRegisterRequestDto dto) {
        log.info("회원가입 요청도 들어왔습니다");

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessLogicException(ExceptionCode.EMAIL_ALREADY_EXISTS);
        }
        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .phoneNumber(dto.getPhoneNumber())
                .role(roleRepository.findByRole("USER")
                        .orElseThrow(() -> new BusinessLogicException(ExceptionCode.ROLE_NOT_AUTH)))
                        //.orElseThrow(() -> new RuntimeException("일반 회원 권한이 없습니다.")))
                .build();

        userRepository.save(user);
    }





}
