package com.pas.backend.dto.config;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ConfigQrResponse {

    private UUID id;
    private Integer expiryMinutes;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
