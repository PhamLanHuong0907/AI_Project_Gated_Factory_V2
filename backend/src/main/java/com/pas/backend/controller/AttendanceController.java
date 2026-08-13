package com.pas.backend.controller;

import com.pas.backend.dto.attendance.AttendanceCheckInRequest;
import com.pas.backend.dto.attendance.AttendanceFilterRequest;
import com.pas.backend.dto.attendance.AttendanceResponse;
import com.pas.backend.dto.attendance.AttendanceStatsResponse;
import com.pas.backend.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance check-in, check-out, stats, and export endpoints")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    @Operation(summary = "Get all attendance records with filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attendance records returned")
    })
    public ResponseEntity<Page<AttendanceResponse>> getAll(
            @PageableDefault(size = 20, sort = "date") Pageable pageable,
            AttendanceFilterRequest filter) {
        String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .findFirst().orElse("");
        UUID currentUserId = UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
        return ResponseEntity.ok(attendanceService.getAllAttendance(pageable, filter, currentUserId, role));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get attendance record by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attendance record found"),
            @ApiResponse(responseCode = "404", description = "Attendance record not found")
    })
    public ResponseEntity<AttendanceResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @PostMapping("/check-in")
    @Operation(summary = "Check in for attendance")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Check-in recorded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid check-in data")
    })
    public ResponseEntity<AttendanceResponse> checkIn(
            @Valid @RequestBody AttendanceCheckInRequest request) {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.checkIn(request, currentUserId));
    }

    @PostMapping("/manual")
    @Operation(summary = "Manually create an attendance record (Admin only)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Attendance record created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    public ResponseEntity<AttendanceResponse> createManualEntry(
            @Valid @RequestBody com.pas.backend.dto.attendance.AttendanceManualCreateRequest request) {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.createManualEntry(request, currentUserId));
    }

    @PostMapping("/{id}/check-out")
    @Operation(summary = "Check out for attendance")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Check-out recorded successfully"),
            @ApiResponse(responseCode = "404", description = "Attendance record not found"),
            @ApiResponse(responseCode = "400", description = "Already checked out")
    })
    public ResponseEntity<AttendanceResponse> checkOut(
            @PathVariable UUID id,
            @RequestBody(required = false) com.pas.backend.dto.attendance.AttendanceCheckOutRequest request) {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return ResponseEntity.ok(attendanceService.checkOut(id, currentUserId, request));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get attendance statistics for a given date and optional user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Statistics returned"),
            @ApiResponse(responseCode = "400", description = "Invalid date parameter")
    })
    public ResponseEntity<AttendanceStatsResponse> getStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) UUID userId) {
        String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .findFirst().orElse("");
        UUID currentUserId = UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
        UUID targetUserId = userId;
        if ("ROLE_EMPLOYEE".equals(role) || "EMPLOYEE".equals(role)) {
            targetUserId = currentUserId;
        }
        return ResponseEntity.ok(attendanceService.getStats(date, targetUserId));
    }

    @GetMapping("/export")
    @Operation(summary = "Export attendance records as CSV")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "CSV file returned"),
            @ApiResponse(responseCode = "400", description = "Invalid date range")
    })
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) UUID userId) {
        String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .findFirst().orElse("");
        UUID currentUserId = UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
        UUID targetUserId = userId;
        if ("ROLE_EMPLOYEE".equals(role) || "EMPLOYEE".equals(role)) {
            targetUserId = currentUserId;
        }
        byte[] csvData = attendanceService.exportCsv(dateFrom, dateTo, targetUserId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment",
                "attendance_" + dateFrom + "_" + dateTo + ".csv");

        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }
}
