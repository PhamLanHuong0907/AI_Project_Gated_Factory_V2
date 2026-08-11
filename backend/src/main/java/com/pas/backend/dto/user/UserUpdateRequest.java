package com.pas.backend.dto.user;

import lombok.Data;

@Data
public class UserUpdateRequest {

    private String employeeCode;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String department;

    private java.util.UUID positionId;

    private Float initialExperienceYears;

    private String avatarUrl;

    private String role;

    private Boolean isActive;
}
