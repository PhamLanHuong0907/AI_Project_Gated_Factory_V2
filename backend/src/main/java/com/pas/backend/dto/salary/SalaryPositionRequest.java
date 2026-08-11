package com.pas.backend.dto.salary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SalaryPositionRequest {

    @NotBlank(message = "Position name is required")
    private String name;

    @NotNull(message = "Base salary is required")
    private BigDecimal baseSalary;

    private String description;

    private Boolean active;

    private List<SalaryPositionExperienceDto> experiences;
}
