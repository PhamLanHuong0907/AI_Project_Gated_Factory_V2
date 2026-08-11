package com.pas.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "salary_position_experiences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryPositionExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", nullable = false)
    @ToString.Exclude
    private SalaryPosition position;

    @Column(nullable = false)
    private String name; // e.g. "1-3 years"

    @Column(name = "min_years", nullable = false)
    private Float minYears;

    @Column(name = "max_years")
    private Float maxYears;

    @Column(name = "salary_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal salaryAmount;
}
