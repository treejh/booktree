package com.example.booktree.user.controller;


import com.example.booktree.blog.dto.request.BlogRequestDto;
import com.example.booktree.role.entity.Role;
import com.example.booktree.user.dto.request.UserRequestDto;
import com.example.booktree.user.dto.response.UserResponseDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import com.example.booktree.user.service.UserService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity postMember(@Valid @RequestBody UserRequestDto userRequestDto) {
        UserResponseDto response = new UserResponseDto(userService.createUser(userRequestDto));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }



}
