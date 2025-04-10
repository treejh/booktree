package com.example.booktree.user.controller;

import com.example.booktree.user.CustomUserDetails;
import com.example.booktree.user.dto.LoginRequestDto;
import com.example.booktree.user.dto.UserRegisterRequestDto;
import com.example.booktree.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserRegisterRequestDto dto) {

        log.info("컨트롤러가 들어왔습니다.");
        userService.register(dto);
        return ResponseEntity.ok("회원가입이 완료되었습니다!");
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto dto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String token = userService.login(dto.getEmail(), dto.getPassword());

        return ResponseEntity.ok(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String bearerToken, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String token = bearerToken.replace("Bearer ", "");
        userService.logout(token);
        //log.info(userDetails + "님이 로그아웃하셨네요");
        return ResponseEntity.ok("로그아웃 성공");
    }

    @GetMapping("/whoami")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails != null) {
            String username = userService.getCurrentUsername(userDetails);
            log.info("현재 로그인한 유저: " + username);
            return ResponseEntity.ok(username + "님이 로그인 중입니다");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다");
        }
    }





}
