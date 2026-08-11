package com.pas.backend.dto.attendance;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AttendanceCheckOutRequest {
    private BigDecimal checkOutLat;
    private BigDecimal checkOutLng;
    private String qrToken;
}
