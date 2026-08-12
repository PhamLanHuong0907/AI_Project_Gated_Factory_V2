package com.pas.backend.repository;

import com.pas.backend.entity.EmpSalaryPenalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmpSalaryPenaltyRepository extends JpaRepository<EmpSalaryPenalty, UUID> {
    List<EmpSalaryPenalty> findByUserId(UUID userId);
    void deleteByUserIdAndPenaltyId(UUID userId, UUID penaltyId);
}
