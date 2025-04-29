package com.example.booktree.email.controller;

import com.example.booktree.email.entity.EmailMessage;
import com.example.booktree.email.service.EmailService;
import com.example.booktree.user.dto.request.UserPasswordRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping("/api/v1/email")
@RestController
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;


	// 임시 비밀번호 발급 
    @PostMapping("/password")
    public ResponseEntity sendPasswordMail(@RequestBody UserPasswordRequestDto.FindPwToEmail findPwToEmail) {
        EmailMessage emailMessage = EmailMessage.builder()
                .to(findPwToEmail.getEmail())
                .subject("[BookTree] 임시 비밀번호 발급")
                .build();

        emailService.sendMail(emailMessage, "password","naver","hihi");

        return ResponseEntity.ok().build();
    }

}