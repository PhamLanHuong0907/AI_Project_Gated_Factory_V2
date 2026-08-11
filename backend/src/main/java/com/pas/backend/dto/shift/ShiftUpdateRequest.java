package com.pas.backend.dto.shift;

import lombok.Data;

@Data
public class ShiftUpdateRequest {

    private String name;

    private String startTime;

    private String endTime;

    private Boolean active;
}
