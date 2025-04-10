package com.example.booktree.jwt;


import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;



@Component
public class JwtUtil {

    private final SecretKey secretKey;

    //private final String SECRET_KEY = Base64.getEncoder().encodeToString("your-secret-key".getBytes());
    private final long EXPIRATION_TIME = 500 * 60 * 60; //30분
    private final ConcurrentHashMap<String, Boolean> invalidTokens = new ConcurrentHashMap<>();

    public JwtUtil() {
        // 강력한 키를 생성하거나 외부에서 주입받는 방식으로
        this.secretKey = Keys.hmacShaKeyFor("my-secret-key--my-secret-key--my-secret-key--my-secret-key--".getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException e) {
            throw new BusinessLogicException(ExceptionCode.INVALID_TOKEN);
        }
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // 이메일 넣은 거 꺼내기
    }


    public Boolean validateToken(String token) {
        try {
            if (invalidTokens.containsKey(token)) return false;

            Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token); // 여기서 예외 안 나면 유효

            return true;

        } catch (JwtException e) {
            throw new BusinessLogicException(ExceptionCode.INVALID_TOKEN);
        }
    }

    public void invalidateToken(String token) {
        invalidTokens.put(token, true);
    }
}
