package com.example.booktree.jwt.filter;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.JwtExceptionCode;
import com.example.booktree.jwt.token.JwtAuthenticationToken;
import com.example.booktree.jwt.util.JwtTokenizer;
import com.example.booktree.role.entity.Role;
import com.example.booktree.security.CustomUserDetails;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;


@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenizer jwtTokenizer;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getToken(request);


        //System.out.println("JwtAuthenticationFilter : "+ token);



        if(StringUtils.hasText(token)){
            try{
                //security에게 authentication를 넘기기 위해서 원하는 데이터를 얻어와서 authentication를 만들어준다.
                Authentication authentication = getAuthentication(token);

                //만들어진 authentication를 SecurityContextHolder의 SecurityContext 로 넘긴다.
                SecurityContextHolder.getContext().setAuthentication(authentication);

            }catch (ExpiredJwtException e){
                request.setAttribute("exception", JwtExceptionCode.EXPIRED_TOKEN.getCode());
                log.error("Expired Token : {}",token,e);
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Expired token exception", e);
            }catch (UnsupportedJwtException e){
                request.setAttribute("exception", JwtExceptionCode.UNSUPPORTED_TOKEN.getCode());
                log.error("Unsupported Token: {}", token, e);
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Unsupported token exception", e);
            } catch (MalformedJwtException e) {
                request.setAttribute("exception", JwtExceptionCode.INVALID_TOKEN.getCode());
                log.error("Invalid Token: {}", token, e);

                SecurityContextHolder.clearContext();

                throw new BadCredentialsException("Invalid token exception", e);
            } catch (IllegalArgumentException e) {
                request.setAttribute("exception", JwtExceptionCode.NOT_FOUND_TOKEN.getCode());
                log.error("Token not found: {}", token, e);

                SecurityContextHolder.clearContext();

                throw new BadCredentialsException("Token not found exception", e);
            }
        }


        filterChain.doFilter(request,response);

    }

    private Authentication getAuthentication(String token){
        Claims claims = jwtTokenizer.parseAccessToken(token);
        String email = claims.getSubject();
        Long userId = claims.get("userId", Long.class);
        String username = claims.get("username", String.class);

        // 유저가 삭제되었는지 확인

        //roles 정보를 꺼내서 Spring Security가 이해할 수 있는 권한 객체 리스트로 변환
        List<GrantedAuthority> grantedAuthorities = getGrantedAuthority(claims);

        //userDetails
        CustomUserDetails customUserDetails = new CustomUserDetails("",email,userId,grantedAuthorities);


        return new JwtAuthenticationToken(grantedAuthorities,customUserDetails,null);

    }

    private List<GrantedAuthority> getGrantedAuthority(Claims claims) {
        List<String> roles = (List<String>) claims.get("roles");

        return roles.stream()
                .map(role -> {
                    // "ROLE_" 접두사가 없으면 붙여주고, 있으면 그대로 사용
                    if (role.startsWith("ROLE_")) {
                        return new SimpleGrantedAuthority(role);
                    } else {
                        return new SimpleGrantedAuthority("ROLE_" + role);
                    }
                })
                .collect(Collectors.toList());
    }



    public String getToken(HttpServletRequest request){
        //헤더에 있는지 확인
        String authorization = request.getHeader("Authorization");

        if(StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")){
            return authorization.substring(7);
        }

        //쿠키에 있는지 확인
        Cookie[] cookies = request.getCookies();
        if(cookies!=null){
            for(Cookie cookie : cookies){
                if("accessToken".equals(cookie.getName())){
                    return cookie.getValue();
                }
            }
        }

        return null;

    }
}
