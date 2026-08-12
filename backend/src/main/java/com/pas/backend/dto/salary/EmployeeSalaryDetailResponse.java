package com.pas.backend.dto.salary;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class EmployeeSalaryDetailResponse {

    private UUID userId;
    private String userName;
    private BigDecimal baseSalary;
    private List<SalaryPositionResponse> positions;
    private List<SalaryExperienceResponse> experiences;
    private List<SalaryBonusResponse> bonuses;
    private List<SalaryPenaltyResponse> penalties;
    private BigDecimal totalBaseSalary;
    private BigDecimal totalBonus;
    private BigDecimal totalPenalty;
    private BigDecimal calculatedSalary;
}
