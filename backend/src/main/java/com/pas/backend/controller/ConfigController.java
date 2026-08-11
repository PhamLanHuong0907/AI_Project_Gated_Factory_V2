package com.pas.backend.controller;

import com.pas.backend.dto.config.ConfigAttendanceRequest;
import com.pas.backend.dto.config.ConfigAttendanceResponse;
import com.pas.backend.dto.config.ConfigGpsRequest;
import com.pas.backend.dto.config.ConfigGpsResponse;
import com.pas.backend.dto.config.ConfigQrRequest;
import com.pas.backend.dto.config.ConfigQrResponse;
import com.pas.backend.service.ConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
@Tag(name = "System Configuration", description = "GPS, QR, and attendance configuration endpoints")
public class ConfigController {

    private final ConfigService configService;

    // ========== GPS Configuration ==========

    @GetMapping("/gps")
    @Operation(summary = "Get GPS configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "GPS configuration returned")
    })
    public ResponseEntity<ConfigGpsResponse> getGpsConfig() {
        return ResponseEntity.ok(configService.getGpsConfig());
    }

    @PutMapping("/gps")
    @Operation(summary = "Update GPS configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "GPS configuration updated"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ConfigGpsResponse> updateGpsConfig(
            @Valid @RequestBody ConfigGpsRequest request) {
        return ResponseEntity.ok(configService.updateGpsConfig(request));
    }

    // ========== QR Configuration ==========

    @GetMapping("/qr")
    @Operation(summary = "Get QR code configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "QR configuration returned")
    })
    public ResponseEntity<ConfigQrResponse> getQrConfig() {
        return ResponseEntity.ok(configService.getQrConfig());
    }

    @PutMapping("/qr")
    @Operation(summary = "Update QR code configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "QR configuration updated"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ConfigQrResponse> updateQrConfig(
            @Valid @RequestBody ConfigQrRequest request) {
        return ResponseEntity.ok(configService.updateQrConfig(request));
    }

    // ========== Attendance Configuration ==========

    @GetMapping("/attendance")
    @Operation(summary = "Get attendance configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attendance configuration returned")
    })
    public ResponseEntity<ConfigAttendanceResponse> getAttendanceConfig() {
        return ResponseEntity.ok(configService.getAttendanceConfig());
    }

    @PutMapping("/attendance")
    @Operation(summary = "Update attendance configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attendance configuration updated"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ConfigAttendanceResponse> updateAttendanceConfig(
            @Valid @RequestBody ConfigAttendanceRequest request) {
        return ResponseEntity.ok(configService.updateAttendanceConfig(request));
    }
}
