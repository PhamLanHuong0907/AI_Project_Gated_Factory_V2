package com.pas.backend.controller;

import com.pas.backend.dto.shift.ShiftCreateRequest;
import com.pas.backend.dto.shift.ShiftResponse;
import com.pas.backend.dto.shift.ShiftUpdateRequest;
import com.pas.backend.service.ShiftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
@Tag(name = "Shifts", description = "Shift management endpoints")
public class ShiftController {

    private final ShiftService shiftService;

    @GetMapping
    @Operation(summary = "Get all shifts with optional search")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Shifts returned successfully")
    })
    public ResponseEntity<Page<ShiftResponse>> getAll(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(shiftService.getAllShifts(pageable, search));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get shift by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Shift found"),
            @ApiResponse(responseCode = "404", description = "Shift not found")
    })
    public ResponseEntity<ShiftResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(shiftService.getShiftById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new shift")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Shift created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ShiftResponse> create(@Valid @RequestBody ShiftCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shiftService.createShift(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing shift")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Shift updated successfully"),
            @ApiResponse(responseCode = "404", description = "Shift not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ShiftResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ShiftUpdateRequest request) {
        return ResponseEntity.ok(shiftService.updateShift(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a shift")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Shift deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Shift not found")
    })
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        shiftService.deleteShift(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Toggle shift active status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Shift active status toggled"),
            @ApiResponse(responseCode = "404", description = "Shift not found")
    })
    public ResponseEntity<ShiftResponse> toggleActive(@PathVariable UUID id) {
        return ResponseEntity.ok(shiftService.toggleActive(id));
    }
}
