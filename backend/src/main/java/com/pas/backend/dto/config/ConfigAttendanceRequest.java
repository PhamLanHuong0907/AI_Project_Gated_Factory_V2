package com.pas.backend.dto.config;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfigAttendanceRequest {

    @NotNull(message = "Late threshold minutes is required")
    private Integer lateThresholdMinutes;

    private Boolean active;
}
