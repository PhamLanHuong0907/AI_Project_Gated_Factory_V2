package com.pas.backend.dto.salary;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SalaryExperienceResponse {

    private UUID id;
    private String name;
    private BigDecimal percentage;
    private Integer minYears;
    private Integer maxYears;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
