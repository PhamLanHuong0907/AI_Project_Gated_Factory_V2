package com.pas.backend.controller;

import com.pas.backend.dto.salary.*;
import com.pas.backend.service.SalaryConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
@Tag(name = "Salary Configuration", description = "Salary position, experience, penalty, bonus management and employee assignment endpoints")
public class SalaryConfigController {

    private final SalaryConfigService salaryConfigService;

    // ========== Positions ==========

    @GetMapping("/positions")
    @Operation(summary = "Get all salary positions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Positions returned")
    })
    public ResponseEntity<List<SalaryPositionResponse>> getAllPositions() {
        return ResponseEntity.ok(salaryConfigService.getAllPositions());
    }

    @PostMapping("/positions")
    @Operation(summary = "Create a new salary position")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Position created"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<SalaryPositionResponse> createPosition(
            @Valid @RequestBody SalaryPositionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(salaryConfigService.createPosition(request));
    }

    @PutMapping("/positions/{id}")
    @Operation(summary = "Update a salary position")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Position updated"),
            @ApiResponse(responseCode = "404", description = "Position not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<SalaryPositionResponse> updatePosition(
            @PathVariable UUID id,
            @Valid @RequestBody SalaryPositionRequest request) {
        return ResponseEntity.ok(salaryConfigService.updatePosition(id, request));
    }

    @DeleteMapping("/positions/{id}")
    @Operation(summary = "Delete a salary position")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Position deleted"),
            @ApiResponse(responseCode = "404", description = "Position not found")
    })
    public ResponseEntity<Void> deletePosition(@PathVariable UUID id) {
        salaryConfigService.deletePosition(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Experience ==========

    @GetMapping("/experience")
    @Operation(summary = "Get all salary experience levels")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Experience levels returned")
    })
    public ResponseEntity<List<SalaryExperienceResponse>> getAllExperience() {
        return ResponseEntity.ok(salaryConfigService.getAllExperience());
    }

    @PostMapping("/experience")
    @Operation(summary = "Create a new salary experience level")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Experience level created"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<SalaryExperienceResponse> createExperience(
            @Valid @RequestBody SalaryExperienceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(salaryConfigService.createExperience(request));
    }

    @PutMapping("/experience/{id}")
    @Operation(summary = "Update a salary experience level")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Experience level updated"),
            @ApiResponse(responseCode = "404", description = "Experience level not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<SalaryExperienceResponse> updateExperience(
            @PathVariable UUID id,
            @Valid @RequestBody SalaryExperienceRequest request) {
        return ResponseEntity.ok(salaryConfigService.updateExperience(id, request));
    }

    @DeleteMapping("/experience/{id}")
    @Operation(summary = "Delete a salary experience level")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Experience level deleted"),
            @ApiResponse(responseCode = "404", description = "Experience level not found")
    })
    public ResponseEntity<Void> deleteExperience(@PathVariable UUID id) {
        salaryConfigService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Penalties ==========

    @GetMapping("/penalties")
    @Operation(summary = "Get all salary penalty types")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Penalties returned")
    })
    public ResponseEntity<List<SalaryPenaltyResponse>> getAllPenalties() {
        return ResponseEntity.ok(salaryConfigService.getAllPenalties());
    }

    @PostMapping("/penalties")
    @Operation(summary = "Create a new salary penalty")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Penalty created"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<SalaryPenaltyResponse> createPenalty(
            @Valid @RequestBody SalaryPenaltyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(salaryConfigService.createPenalty(request));
    }

    @PutMapping("/penalties/{id}")
    @Operation(summary = "Update a salary penalty")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Penalty updated"),
            @ApiResponse(responseCode = "404", description = "Penalty not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<SalaryPenaltyResponse> updatePenalty(
            @PathVariable UUID id,
            @Valid @RequestBody SalaryPenaltyRequest request) {
        return ResponseEntity.ok(salaryConfigService.updatePenalty(id, request));
    }

    @DeleteMapping("/penalties/{id}")
    @Operation(summary = "Delete a salary penalty")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Penalty deleted"),
            @ApiResponse(responseCode = "404", description = "Penalty not found")
    })
    public ResponseEntity<Void> deletePenalty(@PathVariable UUID id) {
        salaryConfigService.deletePenalty(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Bonus ==========

    @GetMapping("/bonus")
    @Operation(summary = "Get all salary bonus types")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bonus types returned")
    })
    public ResponseEntity<List<SalaryBonusResponse>> getAllBonus() {
        return ResponseEntity.ok(salaryConfigService.getAllBonus());
    }

    @PostMapping("/bonus")
    @Operation(summary = "Create a new salary bonus")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Bonus created"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<SalaryBonusResponse> createBonus(
            @Valid @RequestBody SalaryBonusRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(salaryConfigService.createBonus(request));
    }

    @PutMapping("/bonus/{id}")
    @Operation(summary = "Update a salary bonus")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bonus updated"),
            @ApiResponse(responseCode = "404", description = "Bonus not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<SalaryBonusResponse> updateBonus(
            @PathVariable UUID id,
            @Valid @RequestBody SalaryBonusRequest request) {
        return ResponseEntity.ok(salaryConfigService.updateBonus(id, request));
    }

    @DeleteMapping("/bonus/{id}")
    @Operation(summary = "Delete a salary bonus")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Bonus deleted"),
            @ApiResponse(responseCode = "404", description = "Bonus not found")
    })
    public ResponseEntity<Void> deleteBonus(@PathVariable UUID id) {
        salaryConfigService.deleteBonus(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Assign / Unassign ==========

    @PostMapping("/assign/position")
    @Operation(summary = "Assign a salary position to an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Position assigned"),
            @ApiResponse(responseCode = "400", description = "Invalid input or already assigned")
    })
    public ResponseEntity<Void> assignPosition(@Valid @RequestBody SalaryAssignRequest request) {
        salaryConfigService.assignPosition(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/unassign/position")
    @Operation(summary = "Unassign a salary position from an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Position unassigned"),
            @ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    public ResponseEntity<Void> unassignPosition(@Valid @RequestBody SalaryAssignRequest request) {
        salaryConfigService.unassignPosition(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assign/experience")
    @Operation(summary = "Assign a salary experience level to an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Experience assigned"),
            @ApiResponse(responseCode = "400", description = "Invalid input or already assigned")
    })
    public ResponseEntity<Void> assignExperience(@Valid @RequestBody SalaryAssignRequest request) {
        salaryConfigService.assignExperience(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/unassign/experience")
    @Operation(summary = "Unassign a salary experience level from an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Experience unassigned"),
            @ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    public ResponseEntity<Void> unassignExperience(@Valid @RequestBody SalaryAssignRequest request) {
        salaryConfigService.unassignExperience(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assign/bonus")
    @Operation(summary = "Assign a salary bonus to an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Bonus assigned"),
            @ApiResponse(responseCode = "400", description = "Invalid input or already assigned")
    })
    public ResponseEntity<Void> assignBonus(@Valid @RequestBody SalaryAssignRequest request) {
        salaryConfigService.assignBonus(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/unassign/bonus")
    @Operation(summary = "Unassign a salary bonus from an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Bonus unassigned"),
            @ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    public ResponseEntity<Void> unassignBonus(@Valid @RequestBody SalaryAssignRequest request) {
        salaryConfigService.unassignBonus(request);
        return ResponseEntity.noContent().build();
    }

    // ========== Employee Salary Detail ==========

    @GetMapping("/employee/{userId}")
    @Operation(summary = "Get employee salary detail including assigned position, experience, and bonuses")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Employee salary detail returned"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeSalaryDetailResponse> getEmployeeSalaryDetail(
            @PathVariable UUID userId) {
        return ResponseEntity.ok(salaryConfigService.getEmployeeSalaryDetail(userId));
    }

    // ========== Report ==========

    @GetMapping("/report")
    @Operation(summary = "Get salary report for all employees for a specific month")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Salary report returned")
    })
    public ResponseEntity<List<SalaryReportResponse>> getSalaryReport(
            @RequestParam(required = false) String month) {
        return ResponseEntity.ok(salaryConfigService.getSalaryReport(month));
    }
}
