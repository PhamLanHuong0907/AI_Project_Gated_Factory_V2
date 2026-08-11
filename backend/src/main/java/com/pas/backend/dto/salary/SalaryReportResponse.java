package com.pas.backend.dto.salary;

import lombok.Data;
import java.util.UUID;

@Data
public class SalaryReportResponse {
    private UUID userId;
    private String fullName;
    private String employeeCode;
    private String position;
    private double baseSalary;
    private double experienceBonus;
    private double bonuses;
    private double penalties;
    private double netSalary;
}
