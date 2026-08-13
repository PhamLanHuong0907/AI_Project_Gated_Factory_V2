package com.pas.backend.repository;

import com.pas.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID>, JpaSpecificationExecutor<Attendance> {

    List<Attendance> findByUserIdAndDate(UUID userId, LocalDate date);

    List<Attendance> findByUserIdAndDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByDate(LocalDate date);

    long countByStatus(Attendance.Status status);

    boolean existsByUserIdAndCheckInIsNotNullAndDate(UUID userId, LocalDate date);

    boolean existsByUserIdAndShiftIdAndDateAndCheckInIsNotNull(UUID userId, UUID shiftId, LocalDate date);
}
