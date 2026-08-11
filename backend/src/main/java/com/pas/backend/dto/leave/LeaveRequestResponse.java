package com.pas.backend.dto.leave;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class LeaveRequestResponse {

    private UUID id;
    private UUID userId;
    private String userName;
    private String employeeCode;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String status;
    private String attachmentUrls;
    private UUID reviewedBy;
    private String reviewedByName;
    private LocalDateTime reviewedAt;
    private String rejectReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
