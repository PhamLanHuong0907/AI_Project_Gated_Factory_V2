package com.pas.backend.dto.salary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalaryBonusRequest {

    @NotBlank(message = "Bonus name is required")
    private String name;

    @NotBlank(message = "Bonus type is required")
    private String bonusType;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String description;

    private Boolean active;
}
