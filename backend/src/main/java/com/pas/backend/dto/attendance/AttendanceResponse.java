package com.pas.backend.dto.attendance;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AttendanceResponse {

    private UUID id;
    private UUID userId;
    private String userName;
    private String employeeCode;
    private UUID shiftId;
    private String shiftName;
    private String date;
    private String checkInTime;
    private String checkOutTime;
    private String status;
    private BigDecimal checkInLat;
    private BigDecimal checkInLng;
    private BigDecimal checkOutLat;
    private BigDecimal checkOutLng;
    private Integer lateMinutes;
    private Integer earlyMinutes;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
