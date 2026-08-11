package com.pas.backend.dto.config;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ConfigGpsRequest {

    @NotNull(message = "Latitude is required")
    private BigDecimal latitude;

    @NotNull(message = "Longitude is required")
    private BigDecimal longitude;

    @NotNull(message = "Radius is required")
    private BigDecimal radius;

    private String address;

    private Boolean active;
}
