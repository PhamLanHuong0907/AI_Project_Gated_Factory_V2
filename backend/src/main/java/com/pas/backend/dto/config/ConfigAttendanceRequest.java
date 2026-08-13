package com.pas.backend.dto.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfigAttendanceRequest {

    @NotNull(message = "Late threshold is required")
    @Min(value = 0, message = "Late threshold must be positive")
    private Integer lateThresholdMinutes;

    private Boolean active;
}
