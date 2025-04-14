package com.example.booktree.user.service;


import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.jwt.util.JwtTokenizer;
import com.example.booktree.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final HttpServletRequest httpServletRequest;
    private final UserRepository userRepository;
    private final JwtTokenizer jwtTokenizer;


    private String getTokenFromRequest() {
        String authorization = httpServletRequest.getHeader("Authorization");
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            return authorization.substring(7); // "Bearer " 뒤의 토큰 값 추출
        }

        //쿠키에 있는지 확인
        Cookie[] cookies = httpServletRequest.getCookies();
        if(cookies!=null){
            for(Cookie cookie : cookies){
                if("accessToken".equals(cookie.getName())){
                    return cookie.getValue();
                }
            }
        }

        return null;


    }

    public String getEmailFromToken(){
        String token = getTokenFromRequest();

        if (token == null) {
            throw new IllegalArgumentException("Token is missing");  // 토큰이 없으면 예외 처리
        }

        userRepository.findByEmail(jwtTokenizer.getEmailFromToken(token))
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));



        return jwtTokenizer.getEmailFromToken(token);
    }

    public Long getIdFromToken(){


        String token = getTokenFromRequest();

        if (token == null) {
            throw new IllegalArgumentException("Token is missing");  // 토큰이 없으면 예외 처리
        }

        userRepository.findById(jwtTokenizer.getUserIdFromToken(token))
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));


        return jwtTokenizer.getUserIdFromToken(token);

    }
}
