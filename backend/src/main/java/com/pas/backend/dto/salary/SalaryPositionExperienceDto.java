package com.pas.backend.dto.salary;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class SalaryPositionExperienceDto {
    private UUID id;
    private String name;
    private Float minYears;
    private Float maxYears;
    private BigDecimal salaryAmount;
}
