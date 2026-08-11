package com.pas.backend.dto.leave;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestUpdateRequest {

    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;

    private String reason;

    private String attachmentUrls;
}
