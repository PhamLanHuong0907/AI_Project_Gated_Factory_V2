package com.pas.backend.dto.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceStatsResponse {

    private int totalDays;
    private int onTimeCheckIn;
    private int late;
    private int onTimeCheckOut;
    private int earlyLeave;
    private int absent;
    private int leave;
    private double attendanceRate;
}
