package com.pas.backend.repository;

import com.pas.backend.entity.EmpSalaryExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmpSalaryExperienceRepository extends JpaRepository<EmpSalaryExperience, UUID> {

    List<EmpSalaryExperience> findByUserId(UUID userId);

    @Modifying
    @Query("DELETE FROM EmpSalaryExperience ese WHERE ese.userId = :userId AND ese.experienceId = :experienceId")
    void deleteByUserIdAndExperienceId(@Param("userId") UUID userId, @Param("experienceId") UUID experienceId);
}
