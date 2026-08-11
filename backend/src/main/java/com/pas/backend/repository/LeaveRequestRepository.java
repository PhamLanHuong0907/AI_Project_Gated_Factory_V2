package com.pas.backend.repository;

import com.pas.backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, UUID>, JpaSpecificationExecutor<LeaveRequest> {

    List<LeaveRequest> findByUserId(UUID userId);

    List<LeaveRequest> findByUserIdAndStatus(UUID userId, LeaveRequest.Status status);

    long countByStatus(LeaveRequest.Status status);

}
