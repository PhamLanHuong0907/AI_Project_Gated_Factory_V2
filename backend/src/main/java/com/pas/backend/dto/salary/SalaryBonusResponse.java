package com.pas.backend.dto.salary;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SalaryBonusResponse {

    private UUID id;
    private String name;
    private String bonusType;
    private BigDecimal amount;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
