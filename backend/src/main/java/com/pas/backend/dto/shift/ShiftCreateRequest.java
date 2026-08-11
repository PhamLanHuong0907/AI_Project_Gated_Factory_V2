package com.pas.backend.dto.shift;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShiftCreateRequest {

    @NotBlank(message = "Shift name is required")
    private String name;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    private Boolean active;
}
