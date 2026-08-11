package com.pas.backend.repository;

import com.pas.backend.entity.EmpSalaryPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmpSalaryPositionRepository extends JpaRepository<EmpSalaryPosition, UUID> {

    List<EmpSalaryPosition> findByUserId(UUID userId);

    @Modifying
    @Query("DELETE FROM EmpSalaryPosition esp WHERE esp.userId = :userId AND esp.positionId = :positionId")
    void deleteByUserIdAndPositionId(@Param("userId") UUID userId, @Param("positionId") UUID positionId);
}
