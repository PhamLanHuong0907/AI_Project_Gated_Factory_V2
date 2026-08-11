package com.pas.backend.dto.attendance;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class AttendanceCheckInRequest {

    private UUID userId;

    @NotNull(message = "Shift ID is required")
    private UUID shiftId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private BigDecimal checkInLat;

    private BigDecimal checkInLng;

    private String qrToken;

    private String note;
}
