package com.pas.backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.Map;

/**
 * Global exception handler for security-related errors.
 * Translates authentication and authorization failures into
 * consistent JSON responses.
 */
@RestControllerAdvice
public class SecurityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(SecurityExceptionHandler.class);

    /**
     * Handle expired JWT tokens.
     *
     * @param ex the expired JWT exception
     * @return 401 with token-expired message
     */
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Map<String, Object>> handleExpiredJwt(ExpiredJwtException ex) {
        log.debug("Token expired for subject: {}", ex.getClaims().getSubject());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Token has expired");
    }

    /**
     * Handle invalid JWT signatures.
     *
     * @param ex the signature exception
     * @return 401 with invalid-token message
     */
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<Map<String, Object>> handleSignatureException(SignatureException ex) {
        log.debug("Invalid token signature: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid token signature");
    }

    /**
     * Handle malformed JWT tokens.
     *
     * @param ex the malformed JWT exception
     * @return 401 with invalid-token message
     */
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<Map<String, Object>> handleMalformedJwt(MalformedJwtException ex) {
        log.debug("Malformed token: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Malformed token");
    }

    /**
     * Handle any other JWT-related exception.
     *
     * @param ex the generic JWT exception
     * @return 401 with invalid-token message
     */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, Object>> handleJwtException(JwtException ex) {
        log.debug("JWT processing error: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid token");
    }

    /**
     * Handle authentication failures (bad credentials, etc.).
     *
     * @param ex the authentication exception
     * @return 401 with authentication-failed message
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex) {
        log.debug("Authentication failed: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Authentication failed");
    }

    /**
     * Handle bad credentials specifically (login failures).
     *
     * @param ex the bad credentials exception
     * @return 401 with invalid-credentials message
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        log.debug("Bad credentials: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    /**
     * Handle access denied (authorized but insufficient permissions).
     *
     * @param ex the access denied exception
     * @return 403 with access-denied message
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        log.debug("Access denied: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, "Access denied");
    }

    /**
     * Build a standardized error response body.
     *
     * @param status  the HTTP status
     * @param message a human-readable error message
     * @return a ResponseEntity with timestamp, status, and message
     */
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = Map.of(
                "timestamp", OffsetDateTime.now().toString(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message
        );
        return ResponseEntity.status(status).body(body);
    }
}
