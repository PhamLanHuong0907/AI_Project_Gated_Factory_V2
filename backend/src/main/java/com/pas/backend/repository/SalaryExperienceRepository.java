package com.pas.backend.repository;

import com.pas.backend.entity.SalaryExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalaryExperienceRepository extends JpaRepository<SalaryExperience, UUID> {

    Optional<SalaryExperience> findByName(String name);
}
