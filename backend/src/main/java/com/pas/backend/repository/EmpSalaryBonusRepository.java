package com.pas.backend.repository;

import com.pas.backend.entity.EmpSalaryBonus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmpSalaryBonusRepository extends JpaRepository<EmpSalaryBonus, UUID> {

    List<EmpSalaryBonus> findByUserId(UUID userId);

    @Modifying
    @Query("DELETE FROM EmpSalaryBonus esb WHERE esb.userId = :userId AND esb.bonusId = :bonusId")
    void deleteByUserIdAndBonusId(@Param("userId") UUID userId, @Param("bonusId") UUID bonusId);
}
