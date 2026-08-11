package com.pas.backend.service;

import com.pas.backend.dto.auth.AuthResponse;
import com.pas.backend.dto.auth.LoginRequest;
import com.pas.backend.dto.auth.RegisterRequest;
import com.pas.backend.dto.user.UserResponse;
import com.pas.backend.entity.User;
import com.pas.backend.exception.BadRequestException;
import com.pas.backend.repository.UserRepository;
import com.pas.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!user.getIsActive()) {
            throw new BadRequestException("Account is disabled");
        }

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .user(toUserResponse(user))
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.Role.valueOf(request.getRole()))
                .isActive(true)
                .build();

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .user(toUserResponse(user))
                .build();
    }

    private UserResponse toUserResponse(User user) {
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());
        resp.setPhoneNumber(user.getPhone());
        resp.setRole(user.getRole().name());
        resp.setDepartment(user.getDepartment());
        resp.setPositionId(user.getPositionId());
        resp.setInitialExperienceYears(user.getInitialExperienceYears());
        resp.setJoinDate(user.getJoinDate());
        resp.setIsActive(user.getIsActive());
        return resp;
    }
}
