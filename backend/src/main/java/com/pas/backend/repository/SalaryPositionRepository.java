package com.pas.backend.repository;

import com.pas.backend.entity.SalaryPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalaryPositionRepository extends JpaRepository<SalaryPosition, UUID> {

    Optional<SalaryPosition> findByName(String name);
}
