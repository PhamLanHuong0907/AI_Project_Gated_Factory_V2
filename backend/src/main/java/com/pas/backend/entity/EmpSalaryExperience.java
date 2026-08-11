package com.pas.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "emp_salary_experience")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpSalaryExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "experience_id", nullable = false)
    private UUID experienceId;

    @Column(name = "assigned_at", nullable = false)
    private OffsetDateTime assignedAt;
}
