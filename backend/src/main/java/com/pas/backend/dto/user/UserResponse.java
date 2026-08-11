package com.pas.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private UUID id;
    private String employeeCode;
    private String fullName;
    private String email;
    private String role;
    private String phoneNumber;
    private String department;
    private String position; // can keep as position name
    private UUID positionId;
    private Float initialExperienceYears;
    private OffsetDateTime joinDate;
    private Boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
