package com.pas.backend.repository;

import com.pas.backend.entity.ConfigSalary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ConfigSalaryRepository extends JpaRepository<ConfigSalary, UUID> {
}
