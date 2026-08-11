package com.pas.backend.dto.salary;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SalaryAssignRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Config ID is required")
    private UUID configId;
}
