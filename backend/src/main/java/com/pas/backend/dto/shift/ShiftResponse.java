package com.pas.backend.dto.shift;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ShiftResponse {

    private UUID id;
    private String name;
    private String startTime;
    private String endTime;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
