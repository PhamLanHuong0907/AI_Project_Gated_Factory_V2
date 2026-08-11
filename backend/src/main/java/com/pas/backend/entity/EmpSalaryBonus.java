package com.pas.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "emp_salary_bonus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpSalaryBonus {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "bonus_id", nullable = false)
    private UUID bonusId;

    @Column(name = "assigned_at", nullable = false)
    private OffsetDateTime assignedAt;
}
