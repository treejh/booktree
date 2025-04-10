package com.example.booktree.user.controller;


import com.example.booktree.jwt.util.JwtTokenizer;
import com.example.booktree.user.dto.request.UserLoginRequestDto;
import com.example.booktree.user.dto.request.UserPostRequestDto;
import com.example.booktree.user.dto.response.UserLoginResponseDto;
import com.example.booktree.user.dto.response.UserResponseDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtTokenizer jwtTokenizer;

    @PostMapping
    public ResponseEntity postMember(@Valid @RequestBody UserPostRequestDto userPostRequestDto) {
        UserResponseDto response = new UserResponseDto(userService.createUser(userPostRequestDto));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity login(HttpServletResponse response, @RequestBody UserLoginRequestDto userLoginRequestDto){

        User user = userService.findByUserEmail(userLoginRequestDto.getEmail());

        if(!userService.validPassword(userLoginRequestDto.getPassword(),user.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String accessToken = jwtTokenizer.createAccessToken(user.getId(),user.getUsername()
                ,user.getEmail(),user.getRole().getRole().name());
        String refreshToken = jwtTokenizer.createRefreshToken(user.getId(),user.getUsername()
                ,user.getEmail(),user.getRole().getRole().name());

        user.setRefreshToken(refreshToken);

        Cookie accessTokenCookie = new Cookie("accessToken",accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");

        //분단위
        accessTokenCookie.setMaxAge(Math.toIntExact(JwtTokenizer.ACCESS_TOKEN_EXPIRE_COUNT/1000));

        response.addCookie(accessTokenCookie);



        UserLoginResponseDto loginResponseDto=UserLoginResponseDto.builder()
                .accessToken(accessToken)
                .userId(user.getId())
                .email(user.getEmail())
                .build();

        UserLoginResponseDto userLoginResponseDto  = new UserLoginResponseDto(user,accessToken);


        return ResponseEntity.ok(userLoginResponseDto);

    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader(value = "Authorization", required = false) String authorization, HttpServletResponse response) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Authorization header is missing or invalid");
        }

        String token = authorization.substring(7); // "Bearer " 제거

        // accessToken 쿠키 삭제
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");  // 쿠키의 경로 지정
        accessTokenCookie.setMaxAge(0);  // 쿠키의 유효 기간을 0으로 설정하여 삭제
        response.addCookie(accessTokenCookie);

        return ResponseEntity.ok("로그아웃 완료");
    }









}
