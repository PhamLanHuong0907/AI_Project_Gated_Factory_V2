package com.pas.backend.dto.config;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfigQrRequest {

    @NotNull(message = "Expiry minutes is required")
    private Integer expiryMinutes;

    private Boolean active;
}
