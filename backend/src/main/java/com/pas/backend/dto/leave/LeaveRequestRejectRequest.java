package com.pas.backend.dto.leave;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LeaveRequestRejectRequest {

    @NotBlank(message = "Reject reason is required")
    private String rejectReason;
}
