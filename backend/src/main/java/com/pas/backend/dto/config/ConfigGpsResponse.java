package com.pas.backend.dto.config;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ConfigGpsResponse {

    private UUID id;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal radius;
    private String address;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
