package com.pas.backend.dto.attendance;

import lombok.Data;

import java.util.UUID;

@Data
public class AttendanceFilterRequest {

    private UUID userId;

    private UUID shiftId;

    private String dateFrom;

    private String dateTo;

    private String status;
}
