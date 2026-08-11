package com.pas.backend.service;

import com.pas.backend.dto.user.UserCreateRequest;
import com.pas.backend.dto.user.UserResponse;
import com.pas.backend.dto.user.UserUpdateRequest;
import com.pas.backend.entity.User;
import com.pas.backend.exception.BadRequestException;
import com.pas.backend.exception.ResourceNotFoundException;
import com.pas.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserResponse> getAllUsers(Pageable pageable, String search, String role, Boolean isActive) {
        Specification<User> spec = Specification.where(null);

        if (search != null && !search.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("fullName")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("employeeCode")), "%" + search.toLowerCase() + "%")
            ));
        }
        if (role != null && !role.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("role"), User.Role.valueOf(role)));
        }
        if (isActive != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isActive"), isActive));
        }

        return userRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public UserResponse getUserById(java.util.UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        if (userRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new BadRequestException("Employee code already exists");
        }

        User user = User.builder()
                .employeeCode(request.getEmployeeCode())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhoneNumber())
                .role(User.Role.valueOf(request.getRole()))
                .department(request.getDepartment())
                .positionId(request.getPositionId())
                .initialExperienceYears(request.getInitialExperienceYears() != null ? request.getInitialExperienceYears() : 0f)
                .joinDate(java.time.OffsetDateTime.now())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return toResponse(userRepository.save(user));
    }

    public UserResponse updateUser(java.util.UUID id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getEmployeeCode() != null && !request.getEmployeeCode().equals(user.getEmployeeCode())) {
            if (userRepository.existsByEmployeeCode(request.getEmployeeCode())) {
                throw new BadRequestException("Employee code already exists");
            }
            user.setEmployeeCode(request.getEmployeeCode());
        }
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhone(request.getPhoneNumber());
        if (request.getRole() != null) user.setRole(User.Role.valueOf(request.getRole()));
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getPositionId() != null) user.setPositionId(request.getPositionId());
        if (request.getInitialExperienceYears() != null) user.setInitialExperienceYears(request.getInitialExperienceYears());
        if (request.getIsActive() != null) user.setIsActive(request.getIsActive());

        return toResponse(userRepository.save(user));
    }

    public void deleteUser(java.util.UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public long countActiveUsers() {
        return userRepository.count();
    }

    private UserResponse toResponse(User user) {
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setEmployeeCode(user.getEmployeeCode());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());
        resp.setPhoneNumber(user.getPhone());
        resp.setRole(user.getRole().name());
        resp.setDepartment(user.getDepartment());
        resp.setPositionId(user.getPositionId());
        resp.setInitialExperienceYears(user.getInitialExperienceYears());
        resp.setJoinDate(user.getJoinDate());
        resp.setIsActive(user.getIsActive());
        resp.setCreatedAt(user.getCreatedAt());
        resp.setUpdatedAt(user.getUpdatedAt());
        return resp;
    }
}
