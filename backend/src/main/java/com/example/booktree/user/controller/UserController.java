package com.example.booktree.user.controller;

import com.example.booktree.user.dto.UserRegisterRequestDto;
import com.example.booktree.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }


}
