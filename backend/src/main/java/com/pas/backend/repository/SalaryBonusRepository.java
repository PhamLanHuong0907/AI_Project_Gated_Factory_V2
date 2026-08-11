package com.pas.backend.repository;

import com.pas.backend.entity.SalaryBonus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalaryBonusRepository extends JpaRepository<SalaryBonus, UUID> {

    Optional<SalaryBonus> findByName(String name);
}
