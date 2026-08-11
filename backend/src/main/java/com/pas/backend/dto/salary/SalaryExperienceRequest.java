package com.pas.backend.dto.salary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalaryExperienceRequest {

    @NotBlank(message = "Experience name is required")
    private String name;

    @NotNull(message = "Percentage is required")
    private BigDecimal percentage;

    @NotNull(message = "Min years is required")
    private Integer minYears;

    private Integer maxYears;

    private Boolean active;
}
