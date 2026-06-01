package com.library.security;

import com.library.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Issues and validates JWT access tokens. Tokens are signed with HMAC-SHA256 — keep the secret out of
 * source control in production and rotate it if compromised.
 */
@Component
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    public String generateToken(String username, String role, Long userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getExpirationMs());
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .claim("uid", userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey())
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String expectedUsername) {
        String subject = extractUsername(token);
        return subject != null && subject.equals(expectedUsername) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }

    public long extractExpirationEpochMs(String token) {
        return parseClaims(token).getExpiration().getTime();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey() {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = digest.digest(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
