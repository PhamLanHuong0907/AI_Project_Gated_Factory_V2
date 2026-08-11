package com.pas.backend.controller;

import com.pas.backend.dto.common.FileUploadResponse;
import com.pas.backend.dto.leave.LeaveRequestCreateRequest;
import com.pas.backend.dto.leave.LeaveRequestRejectRequest;
import com.pas.backend.dto.leave.LeaveRequestResponse;
import com.pas.backend.dto.leave.LeaveRequestUpdateRequest;
import com.pas.backend.service.LeaveRequestService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
@Tag(name = "Leave Requests", description = "Leave request management, approval, and file upload endpoints")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @GetMapping
    @Operation(summary = "Get all leave requests with filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leave requests returned")
    })
    public ResponseEntity<Page<LeaveRequestResponse>> getAll(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests(
                pageable, status, userId, dateFrom, dateTo, search));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get leave request by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leave request found"),
            @ApiResponse(responseCode = "404", description = "Leave request not found")
    })
    public ResponseEntity<LeaveRequestResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestById(id));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's leave requests")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leave requests returned")
    })
    public ResponseEntity<Page<LeaveRequestResponse>> getMyRequests(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @RequestParam(required = false) String status) {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveRequestService.getMyLeaveRequests(currentUserId, pageable, status));
    }

    @PostMapping
    @Operation(summary = "Create a new leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Leave request created"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<LeaveRequestResponse> create(
            @Valid @RequestBody LeaveRequestCreateRequest request) {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(leaveRequestService.createLeaveRequest(request, currentUserId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leave request updated"),
            @ApiResponse(responseCode = "404", description = "Leave request not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<LeaveRequestResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody LeaveRequestUpdateRequest request) {
        return ResponseEntity.ok(leaveRequestService.updateLeaveRequest(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Leave request deleted"),
            @ApiResponse(responseCode = "404", description = "Leave request not found")
    })
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        leaveRequestService.deleteLeaveRequest(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve a leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leave request approved"),
            @ApiResponse(responseCode = "404", description = "Leave request not found"),
            @ApiResponse(responseCode = "400", description = "Leave request is not in PENDING status")
    })
    public ResponseEntity<LeaveRequestResponse> approve(@PathVariable UUID id) {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveRequestService.approveLeaveRequest(id, currentUserId));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject a leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leave request rejected"),
            @ApiResponse(responseCode = "404", description = "Leave request not found"),
            @ApiResponse(responseCode = "400", description = "Leave request is not in PENDING status")
    })
    public ResponseEntity<LeaveRequestResponse> reject(
            @PathVariable UUID id,
            @Valid @RequestBody LeaveRequestRejectRequest request) {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveRequestService.rejectLeaveRequest(id, request, currentUserId));
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload a file attachment for a leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "File uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "File too large or invalid type")
    })
    public ResponseEntity<FileUploadResponse> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(leaveRequestService.uploadFile(file));
    }
}
