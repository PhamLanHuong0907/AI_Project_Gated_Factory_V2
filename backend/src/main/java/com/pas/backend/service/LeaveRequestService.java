package com.pas.backend.service;

import com.pas.backend.dto.common.FileUploadResponse;
import com.pas.backend.dto.leave.LeaveRequestCreateRequest;
import com.pas.backend.dto.leave.LeaveRequestRejectRequest;
import com.pas.backend.dto.leave.LeaveRequestResponse;
import com.pas.backend.dto.leave.LeaveRequestUpdateRequest;
import com.pas.backend.entity.LeaveRequest;
import com.pas.backend.entity.User;
import com.pas.backend.exception.BadRequestException;
import com.pas.backend.exception.ResourceNotFoundException;
import com.pas.backend.repository.LeaveRequestRepository;
import com.pas.backend.repository.UserRepository;
import com.pas.backend.repository.AttendanceRepository;
import com.pas.backend.entity.Attendance;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;

    public Page<LeaveRequestResponse> getAllLeaveRequests(Pageable pageable, String status,
            UUID userId, LocalDate from, LocalDate to, String search) {
        Specification<LeaveRequest> spec = Specification.where(null);

        if (status != null && !status.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), LeaveRequest.Status.valueOf(status)));
        }
        if (userId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("userId"), userId));
        }
        if (from != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("leaveDate"), from));
        }
        if (to != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("leaveDate"), to));
        }

        return leaveRequestRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public LeaveRequestResponse getLeaveRequestById(UUID id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        return toResponse(leaveRequest);
    }

    public Page<LeaveRequestResponse> getMyLeaveRequests(UUID userId, Pageable pageable, String status) {
        Specification<LeaveRequest> spec = Specification.where(null);

        spec = spec.and((root, query, cb) -> cb.equal(root.get("userId"), userId));

        if (status != null && !status.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), LeaveRequest.Status.valueOf(status)));
        }

        return leaveRequestRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional
    public LeaveRequestResponse createLeaveRequest(LeaveRequestCreateRequest request, UUID currentUserId) {
        if (!userRepository.existsById(currentUserId)) {
            throw new ResourceNotFoundException("User not found with id: " + currentUserId);
        }

        // Check for duplicate leave request on the same dates
        // Simplified check, could be expanded to check overlapping date ranges
        
        LeaveRequest leaveRequest = LeaveRequest.builder()
                .userId(currentUserId)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveRequest.Status.PENDING)
                .attachmentUrls(request.getAttachmentUrls() != null ? request.getAttachmentUrls() : "[]")
                .build();

        return toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional
    public LeaveRequestResponse updateLeaveRequest(UUID id, LeaveRequestUpdateRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != LeaveRequest.Status.PENDING) {
            throw new BadRequestException("Only PENDING leave requests can be updated");
        }

        if (request.getLeaveType() != null) leaveRequest.setLeaveType(request.getLeaveType());
        if (request.getStartDate() != null) leaveRequest.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) leaveRequest.setEndDate(request.getEndDate());
        if (request.getReason() != null) leaveRequest.setReason(request.getReason());
        if (request.getAttachmentUrls() != null) leaveRequest.setAttachmentUrls(request.getAttachmentUrls());

        return toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional
    public void deleteLeaveRequest(UUID id) {
        if (!leaveRequestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Leave request not found with id: " + id);
        }
        leaveRequestRepository.deleteById(id);
    }

    @Transactional
    public LeaveRequestResponse approveLeaveRequest(UUID id, UUID reviewerId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != LeaveRequest.Status.PENDING) {
            throw new BadRequestException("Only PENDING leave requests can be approved");
        }

        leaveRequest.setStatus(LeaveRequest.Status.APPROVED);
        leaveRequest.setReviewedBy(reviewerId);
        leaveRequest.setReviewedAt(OffsetDateTime.now());

        // Create Attendance records for the approved leave duration
        LocalDate current = leaveRequest.getStartDate();
        while (!current.isAfter(leaveRequest.getEndDate())) {
            if (attendanceRepository.findByUserIdAndDate(leaveRequest.getUserId(), current).isEmpty()) {
                Attendance attendance = Attendance.builder()
                        .userId(leaveRequest.getUserId())
                        .date(current)
                        .status(Attendance.Status.ON_LEAVE)
                        .notes(leaveRequest.getLeaveType())
                        .lateMinutes(0)
                        .earlyMinutes(0)
                        .build();
                attendanceRepository.save(attendance);
            }
            current = current.plusDays(1);
        }

        return toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional
    public LeaveRequestResponse rejectLeaveRequest(UUID id, LeaveRequestRejectRequest request, UUID reviewerId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != LeaveRequest.Status.PENDING) {
            throw new BadRequestException("Only PENDING leave requests can be rejected");
        }

        leaveRequest.setStatus(LeaveRequest.Status.REJECTED);
        leaveRequest.setReviewedBy(reviewerId);
        leaveRequest.setReviewedAt(OffsetDateTime.now());
        leaveRequest.setRejectReason(request.getRejectReason());

        return toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional
    public FileUploadResponse uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID() + extension;
            Path uploadDir = Paths.get("uploads");
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(filename);
            file.transferTo(filePath.toFile());

            return FileUploadResponse.builder()
                    .fileUrl("/uploads/" + filename)
                    .fileName(originalFilename)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .build();
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    private LeaveRequestResponse toResponse(LeaveRequest leaveRequest) {
        User user = userRepository.findById(leaveRequest.getUserId()).orElse(null);
        User reviewer = leaveRequest.getReviewedBy() != null
                ? userRepository.findById(leaveRequest.getReviewedBy()).orElse(null) : null;

        LeaveRequestResponse response = new LeaveRequestResponse();
        response.setId(leaveRequest.getId());
        response.setUserId(leaveRequest.getUserId());
        response.setUserName(user != null ? user.getFullName() : null);
        response.setEmployeeCode(user != null ? user.getEmployeeCode() : null);
        response.setLeaveType(leaveRequest.getLeaveType());
        response.setStartDate(leaveRequest.getStartDate());
        response.setEndDate(leaveRequest.getEndDate());
        response.setReason(leaveRequest.getReason());
        response.setStatus(leaveRequest.getStatus().name());
        response.setAttachmentUrls(leaveRequest.getAttachmentUrls());
        response.setReviewedBy(leaveRequest.getReviewedBy());
        response.setReviewedByName(reviewer != null ? reviewer.getFullName() : null);
        response.setReviewedAt(leaveRequest.getReviewedAt() != null
                ? leaveRequest.getReviewedAt().toLocalDateTime() : null);
        response.setRejectReason(leaveRequest.getRejectReason());
        response.setCreatedAt(leaveRequest.getCreatedAt() != null
                ? leaveRequest.getCreatedAt().toLocalDateTime() : null);
        response.setUpdatedAt(leaveRequest.getUpdatedAt() != null
                ? leaveRequest.getUpdatedAt().toLocalDateTime() : null);
        return response;
    }
}