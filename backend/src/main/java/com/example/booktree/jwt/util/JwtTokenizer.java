package com.example.booktree.jwt.util;

import com.example.booktree.oauth.domain.SecurityUser;
import com.example.booktree.role.entity.Role;
import com.example.booktree.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


@Component
public class JwtTokenizer {

    private final byte [] accessSecret;
    private final byte [] refreshSecret;


    //토큰 만료 시간이 달라지면 안되기 때문에 static으로 사용해야 한다.
    public static final Long ACCESS_TOKEN_EXPIRE_COUNT = 30 * 60 * 1000L;  // 30분

    public static final Long REFRESH_TOKEN_EXPIRE_COUNT = 5 * 60 * 60 * 1000L;

    // Refresh Token 유효기간: 1일 (24시간 * 60분 * 60초 * 1000ms)




    //야물 파일에 있는 데이터를 가지고 온다.
    public JwtTokenizer(@Value("${jwt.secretKey}") String accessSecret, @Value("${jwt.refreshKey}") String refreshSecret) {
        this.accessSecret = accessSecret.getBytes(StandardCharsets.UTF_8);
        this.refreshSecret = refreshSecret.getBytes(StandardCharsets.UTF_8);
    }

    //토큰은 인증에 대한 정보만 들어가게 하고, 비밀번호는 넣지 않는다(보안 문제 상 ) 불필요한 애들은 빼도 괜춘 ㅇㅇ
    private String createToken(Long id, String email, String username, String role,
                               Long expire, byte[] secretKey){
        //필요한 정보들을 저장한다.
        //고유한 식별자 값이 subject에 들어가는게 좋다 (이메일 중복 안될테니 걍 이메일 넣은거임)
        Claims claims = Jwts.claims()
                .setSubject(email);

        //토큰을 만들어서 클라이언트한테 보낼때 포함될 값들을 저장하고 있는걱임ㅇ ㅇㅇ
        //클레임 종류
        //1. jwt가 가지고 있는 claim
        //2. jwt가 가지고 있지 않은 정보
        claims.put("username", username);
        claims.put("userId",id);
        claims.put("roles", List.of(role));



        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + expire))//만료시간 : , 현재 시간 + expire 더한값 -> 언제까지 사용할지
                .signWith(getSigningKey(secretKey))
                .compact();


    }

    //값을 꺼내려고 하니 토큰, 시크릿키를 추가할 수 있는 메서드 만듬
    public Claims parseAccessToken(String accessToken){
        return parseToken(accessToken,accessSecret);
    }


    //토큰을 -> claims 로
    public Claims parseRefreshToken(String refreshToken){
        return parseToken(refreshToken,accessSecret);

    }

    private static Key getSigningKey(byte[] secretKey){
        return Keys.hmacShaKeyFor(secretKey);
    }

    public String createAccessToken(Long id, String email, String username, String role){
        return createToken(id,email,username,role, ACCESS_TOKEN_EXPIRE_COUNT,accessSecret);
    }

    public String createRefreshToken(Long id, String email, String username, String role){
        return createToken(id,email,username,role, REFRESH_TOKEN_EXPIRE_COUNT,refreshSecret);
    }

    //받은 토큰에서 데이터 받는 메서드
    public Claims parseToken(String token, byte[] secretKey){

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey(secretKey))
                .build()
                .parseClaimsJws(token)
                .getBody();

        // 만료 시간 체크
        checkTokenExpiration(claims);


        return claims;

    }
    private void checkTokenExpiration(Claims claims) {
        Date expiration = claims.getExpiration();
//        System.out.println("현재시간 확인!!: " + new Date());
//        System.out.println("만료시간 확인 !!!  "+ expiration);
        if (expiration != null && expiration.before(new Date())) {
            throw new IllegalArgumentException("토큰이 만료되었습니다.");
        }
    }



    public String getEmailFromToken(String token){
        if(token == null || token.isBlank()){
            throw new IllegalArgumentException("JWT 토큰이 없습니다.");
        }

        //Bearer로 시작해서 그거 없애주려고

        Claims claims = parseToken(token, accessSecret);

        if(claims == null){
            throw new IllegalArgumentException("유효하지 않은 형식입니다.");
        }

        Object email = claims.get("email");

        //return Long.valueOf((Integer)claims.get("id"));

        if(email instanceof String){
            return ((String)email);
        }else{
            throw new IllegalArgumentException("JWT토큰에서 email를 찾을 수 없습니다.");
        }

    }


    public Long getUserIdFromToken(String token){
        if(token == null || token.isBlank()){
            throw new IllegalArgumentException("JWT 토큰이 없습니다.");
        }

        Claims claims = parseToken(token, accessSecret);

        if(claims == null){
            throw new IllegalArgumentException("유효하지 않은 형식입니다.");
        }
        Object userId = claims.get("userId");
        if(userId instanceof Number){
            return ((Number)userId).longValue();
        }else{
            throw new IllegalArgumentException("JWT토큰에서 userId를 찾을 수 없습니다.");
        }

    }



    //시큐리티에서 정보 얻어오기
    public User getUser(){
        return Optional.ofNullable(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        )
                .map(Authentication::getPrincipal)
                .filter(principal -> principal instanceof SecurityUser)
                .map(principal -> (SecurityUser)principal)
                .map(securityUser -> User
                        .builder()
                        .id(securityUser.getId())
                        .username(securityUser.getUsername())
                        .email(securityUser.getEmail())
                        .build())
                .orElse(null);
    }

}




