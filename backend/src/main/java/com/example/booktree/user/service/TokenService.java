package com.example.booktree.user.service;


import com.example.booktree.jwt.util.JwtTokenizer;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final HttpServletRequest httpServletRequest;
    private final JwtTokenizer jwtTokenizer;


    private String getTokenFromRequest() {
        String authorization = httpServletRequest.getHeader("Authorization");
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            return authorization.substring(7); // "Bearer " 뒤의 토큰 값 추출
        }
        return null;
    }

    public String getEmailFromToken(){
        String token = getTokenFromRequest();

        if (token == null) {
            throw new IllegalArgumentException("Token is missing");  // 토큰이 없으면 예외 처리
        }


        return jwtTokenizer.getEmailFromToken(token);
    }

    public Long getIdFromToken(){
        String token = getTokenFromRequest();

        if (token == null) {
            throw new IllegalArgumentException("Token is missing");  // 토큰이 없으면 예외 처리
        }

        return jwtTokenizer.getUserIdFromToken(token);

    }
}
