package com.example.booktree.oauth.handler;

//프론트로

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.jwt.util.JwtTokenizer;
import com.example.booktree.oauth.app.AppConfig;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import com.example.booktree.user.service.TokenService;
import com.example.booktree.user.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;


//onAuthenticationSuccess 이걸 통해서 2번의 정보를 통해 토큰을 생성하고 return
@Component
@RequiredArgsConstructor
public class CustomOAuth2AuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

   private final JwtTokenizer jwtTokenizer;
   private final TokenService tokenService;
   private final UserRepository userRepository;

 @Override
 public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                     Authentication authentication) throws ServletException, IOException {

     User user = userRepository.findById(jwtTokenizer.getUser().getId())
             .orElseThrow(()->new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

     //토큰 발급
     //jwtTokenizer.createAccessToken(user.getId(),user.getEmail(),user.getUsername(),user.getRole().toString());
     tokenService.makeAuthCookies(user);
     String redirectUrl = request.getParameter("state");



     //프론트 주소로 redirect
     response.sendRedirect(redirectUrl);
    }
}