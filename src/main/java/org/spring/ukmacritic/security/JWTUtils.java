package org.spring.ukmacritic.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.spring.ukmacritic.dto.user.UserProfileDto;
import org.spring.ukmacritic.dto.user.UserResponseDto;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JWTUtils {

    private static final Key SECRET = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(UserResponseDto user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.userId()))
//                .claim("login", user.login())
//                .claim("name", user.userName())
                .claim("role", String.valueOf(user.state()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(SECRET, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUserId(String token) {
        return extractToken(token).getSubject();
    }

//    public String extractLogin(String token) {
//        return extractToken(token).get("login", String.class);
//    }

//    public String extractName(String token) {
//        return extractToken(token).get("name", String.class);
//    }

    public String extractRole(String token) {
        return extractToken(token).get("role", String.class);
    }
    public boolean validateToken(String token, String userId) {
        return userId.equals(extractUserId(token)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }

}
