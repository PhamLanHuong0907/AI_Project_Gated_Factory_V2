package com.pas.backend.dto.salary;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class SalaryPositionResponse {

    private UUID id;
    private String name;
    private BigDecimal baseSalary;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<SalaryPositionExperienceDto> experiences;
}
