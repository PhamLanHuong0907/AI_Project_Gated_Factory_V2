package com.pas.backend.dto.attendance;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class AttendanceManualCreateRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    private UUID shiftId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private LocalTime checkInTime;
    
    private LocalTime checkOutTime;

    @NotNull(message = "Status is required")
    private String status;

    private Integer lateMinutes;
    
    private Integer earlyMinutes;

    private String note;
}
