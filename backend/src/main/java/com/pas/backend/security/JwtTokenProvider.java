package com.pas.backend.security;

import com.pas.backend.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

/**
 * Provider for JWT token generation, validation, and extraction.
 * Uses jjwt 0.12.x API.
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String secretBase64;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    @Value("${app.jwt.issuer}")
    private String issuer;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretBase64);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate a signed JWT token from a User entity.
     *
     * @param user the authenticated user
     * @return signed compact JWT string
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(user.getId().toString())
                .issuer(issuer)
                .claim("employeeCode", user.getEmployeeCode())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Validate a JWT token.
     *
     * @param token the JWT string to validate
     * @return true if the token is valid and not expired
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extract the user ID (subject) from the token.
     *
     * @param token the JWT string
     * @return the user ID as UUID
     */
    public UUID extractUserId(String token) {
        Claims claims = parseClaims(token);
        return UUID.fromString(claims.getSubject());
    }

    /**
     * Extract the email claim from the token.
     *
     * @param token the JWT string
     * @return the email address
     */
    public String extractEmail(String token) {
        Claims claims = parseClaims(token);
        return claims.get("email", String.class);
    }

    /**
     * Extract the role claim from the token.
     *
     * @param token the JWT string
     * @return the role name (e.g. EMPLOYEE, HR_MANAGER, ADMIN)
     */
    public String extractRole(String token) {
        Claims claims = parseClaims(token);
        return claims.get("role", String.class);
    }

    /**
     * Extract the employee code claim from the token.
     *
     * @param token the JWT string
     * @return the employee code
     */
    public String extractEmployeeCode(String token) {
        Claims claims = parseClaims(token);
        return claims.get("employeeCode", String.class);
    }

    /**
     * Parse and return all claims from a token.
     *
     * @param token the JWT string
     * @return parsed Claims object
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
