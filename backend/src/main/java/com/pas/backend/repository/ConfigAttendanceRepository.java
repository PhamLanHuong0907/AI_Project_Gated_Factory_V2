package com.pas.backend.repository;

import com.pas.backend.entity.ConfigAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConfigAttendanceRepository extends JpaRepository<ConfigAttendance, UUID> {

    Optional<ConfigAttendance> findFirstByIsActiveTrue();
}
