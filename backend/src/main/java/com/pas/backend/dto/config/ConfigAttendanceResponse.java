package com.pas.backend.dto.config;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ConfigAttendanceResponse {

    private UUID id;
    private Integer lateThresholdMinutes;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
