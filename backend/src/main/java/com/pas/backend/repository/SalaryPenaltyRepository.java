package com.pas.backend.repository;

import com.pas.backend.entity.SalaryPenalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalaryPenaltyRepository extends JpaRepository<SalaryPenalty, UUID> {

    Optional<SalaryPenalty> findByName(String name);
}
