package com.pas.backend.service;

import com.pas.backend.dto.attendance.AttendanceCheckInRequest;
import com.pas.backend.dto.attendance.AttendanceFilterRequest;
import com.pas.backend.dto.attendance.AttendanceManualCreateRequest;
import com.pas.backend.dto.attendance.AttendanceResponse;
import com.pas.backend.dto.attendance.AttendanceStatsResponse;
import com.pas.backend.entity.Attendance;
import com.pas.backend.entity.ConfigAttendance;
import com.pas.backend.entity.Shift;
import com.pas.backend.entity.User;
import com.pas.backend.exception.BadRequestException;
import com.pas.backend.exception.ResourceNotFoundException;
import com.pas.backend.repository.AttendanceRepository;
import com.pas.backend.repository.ConfigAttendanceRepository;
import com.pas.backend.repository.ShiftRepository;
import com.pas.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final ShiftRepository shiftRepository;
    private final ConfigAttendanceRepository configAttendanceRepository;

    public Page<AttendanceResponse> getAllAttendance(Pageable pageable, AttendanceFilterRequest filter) {
        Specification<Attendance> spec = Specification.where(null);

        if (filter != null) {
            if (filter.getUserId() != null) {
                spec = spec.and((root, query, cb) -> cb.equal(root.get("userId"), filter.getUserId()));
            }
            if (filter.getStatus() != null && !filter.getStatus().isBlank()) {
                spec = spec.and((root, query, cb) -> cb.equal(root.get("status"),
                        Attendance.Status.valueOf(filter.getStatus())));
            }
            if (filter.getShiftId() != null) {
                spec = spec.and((root, query, cb) -> cb.equal(root.get("shiftId"), filter.getShiftId()));
            }
            if (filter.getDateFrom() != null && !filter.getDateFrom().isBlank()) {
                LocalDate from = LocalDate.parse(filter.getDateFrom());
                spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("date"), from));
            }
            if (filter.getDateTo() != null && !filter.getDateTo().isBlank()) {
                LocalDate to = LocalDate.parse(filter.getDateTo());
                spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("date"), to));
            }
        }

        return attendanceRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public AttendanceResponse getAttendanceById(UUID id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));
        return toResponse(attendance);
    }

    @Transactional
    public AttendanceResponse checkIn(AttendanceCheckInRequest request, UUID currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));

        UUID targetUserId = currentUserId;
        if (request.getUserId() != null && !request.getUserId().equals(currentUserId)) {
            if (!"ADMIN".equals(currentUser.getRole().name()) && !"HR_MANAGER".equals(currentUser.getRole().name())) {
                throw new BadRequestException("You do not have permission to check in for another user");
            }
            targetUserId = request.getUserId();
        }

        if (attendanceRepository.existsByUserIdAndCheckInIsNotNullAndDate(targetUserId, request.getDate())) {
            throw new BadRequestException("Already checked in for date: " + request.getDate());
        }

        Shift shift = shiftRepository.findById(request.getShiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + request.getShiftId()));

        ConfigAttendance config = configAttendanceRepository.findFirstByIsActiveTrue().orElse(null);
        int lateThresholdMinutes = (config != null) ? config.getLateThresholdMinutes() : 0;

        OffsetDateTime checkInTime = OffsetDateTime.now();
        LocalTime shiftStart = shift.getStartTime();
        
        // Render runs on UTC. We must convert to Vietnam timezone before extracting LocalTime
        LocalTime checkInLocalTime = checkInTime.atZoneSameInstant(java.time.ZoneId.of("Asia/Ho_Chi_Minh")).toLocalTime();
        
        int lateMinutes = 0;
        Attendance.Status status = Attendance.Status.ON_TIME;

        if (checkInLocalTime.isAfter(shiftStart.plusMinutes(lateThresholdMinutes))) {
            long diffMinutes = Duration.between(shiftStart, checkInLocalTime).toMinutes();
            lateMinutes = (int) diffMinutes;
            status = Attendance.Status.LATE;
        }

        Attendance attendance = Attendance.builder()
                .userId(targetUserId)
                .shiftId(request.getShiftId())
                .checkIn(checkInTime)
                .date(request.getDate())
                .status(status)
                .lateMinutes(lateMinutes)
                .earlyMinutes(0)
                .gpsLat(request.getCheckInLat())
                .gpsLng(request.getCheckInLng())
                .qrToken(request.getQrToken())
                .notes(request.getNote())
                .build();

        return toResponse(attendanceRepository.save(attendance));
    }

    @Transactional
    public AttendanceResponse createManualEntry(AttendanceManualCreateRequest request, UUID currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));
        
        if (!"ADMIN".equals(currentUser.getRole().name()) && !"HR_MANAGER".equals(currentUser.getRole().name())) {
            throw new BadRequestException("You do not have permission to manually create attendance records");
        }

        ZoneId zoneId = ZoneId.systemDefault();
        OffsetDateTime checkInDt = request.getCheckInTime() != null 
            ? request.getDate().atTime(request.getCheckInTime()).atZone(zoneId).toOffsetDateTime() 
            : null;
            
        OffsetDateTime checkOutDt = request.getCheckOutTime() != null 
            ? request.getDate().atTime(request.getCheckOutTime()).atZone(zoneId).toOffsetDateTime() 
            : null;

        // Check if a record already exists for this date
        Attendance existing = attendanceRepository.findByUserIdAndDate(request.getUserId(), request.getDate()).stream().findFirst().orElse(null);

        Attendance attendance;
        if (existing != null) {
            if (checkInDt != null) existing.setCheckIn(checkInDt);
            if (checkOutDt != null) existing.setCheckOut(checkOutDt);
            if (request.getShiftId() != null) existing.setShiftId(request.getShiftId());
            existing.setStatus(Attendance.Status.valueOf(request.getStatus()));
            existing.setLateMinutes(request.getLateMinutes() != null ? request.getLateMinutes() : existing.getLateMinutes());
            existing.setEarlyMinutes(request.getEarlyMinutes() != null ? request.getEarlyMinutes() : existing.getEarlyMinutes());
            if (request.getNote() != null) existing.setNotes(request.getNote());
            attendance = existing;
        } else {
            attendance = Attendance.builder()
                .userId(request.getUserId())
                .shiftId(request.getShiftId())
                .date(request.getDate())
                .checkIn(checkInDt)
                .checkOut(checkOutDt)
                .status(Attendance.Status.valueOf(request.getStatus()))
                .lateMinutes(request.getLateMinutes() != null ? request.getLateMinutes() : 0)
                .earlyMinutes(request.getEarlyMinutes() != null ? request.getEarlyMinutes() : 0)
                .notes(request.getNote())
                .build();
        }

        return toResponse(attendanceRepository.save(attendance));
    }

    @Transactional
    public AttendanceResponse checkOut(UUID attendanceId, UUID currentUserId, com.pas.backend.dto.attendance.AttendanceCheckOutRequest request) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + attendanceId));

        if (!attendance.getUserId().equals(currentUserId)) {
            throw new BadRequestException("Attendance record does not belong to current user");
        }

        if (attendance.getCheckOut() != null) {
            throw new BadRequestException("Already checked out for this attendance record");
        }

        OffsetDateTime checkOutTime = OffsetDateTime.now();
        attendance.setCheckOut(checkOutTime);
        if (request != null) {
            if (request.getCheckOutLat() != null) attendance.setCheckOutLat(request.getCheckOutLat());
            if (request.getCheckOutLng() != null) attendance.setCheckOutLng(request.getCheckOutLng());
        }
        
        int earlyMinutes = 0;
        if (attendance.getShiftId() != null) {
            Shift shift = shiftRepository.findById(attendance.getShiftId()).orElse(null);
            if (shift != null) {
                int earlyThresholdMinutes = 0; // Not available in config yet
                
                LocalTime shiftEnd = shift.getEndTime();
                
                // Convert UTC time to Vietnam timezone before extracting LocalTime
                LocalTime checkOutLocal = checkOutTime.atZoneSameInstant(java.time.ZoneId.of("Asia/Ho_Chi_Minh")).toLocalTime();
                
                if (checkOutLocal.isBefore(shiftEnd.minusMinutes(earlyThresholdMinutes))) {
                    earlyMinutes = (int) Duration.between(checkOutLocal, shiftEnd).toMinutes();
                }
            }
        }
        attendance.setEarlyMinutes(earlyMinutes);

        return toResponse(attendanceRepository.save(attendance));
    }

    public AttendanceStatsResponse getStats(LocalDate date, UUID userId) {
        List<Attendance> records;
        if (userId != null) {
            records = attendanceRepository.findByUserIdAndDate(userId, date);
        } else {
            records = attendanceRepository.findByDate(date);
        }

        int totalDays = records.size();
        int onTimeCheckIn = 0;
        int late = 0;
        int onTimeCheckOut = 0;
        int earlyLeave = 0;
        int absent = 0;
        int leave = 0;

        for (Attendance record : records) {
            if (record.getStatus() == Attendance.Status.ABSENT) {
                absent++;
                continue;
            }
            if (record.getStatus() == Attendance.Status.ON_LEAVE) {
                leave++;
                continue;
            }

            if (record.getCheckIn() != null) {
                if (record.getLateMinutes() != null && record.getLateMinutes() > 0) {
                    late++;
                } else {
                    onTimeCheckIn++;
                }
            }
            
            if (record.getCheckOut() != null) {
                if (record.getEarlyMinutes() != null && record.getEarlyMinutes() > 0) {
                    earlyLeave++;
                } else {
                    onTimeCheckOut++;
                }
            }
        }

        double attendanceRate = totalDays > 0
                ? (double) (onTimeCheckIn + late) / totalDays * 100
                : 0;

        return AttendanceStatsResponse.builder()
                .totalDays(totalDays)
                .onTimeCheckIn(onTimeCheckIn)
                .late(late)
                .onTimeCheckOut(onTimeCheckOut)
                .earlyLeave(earlyLeave)
                .absent(absent)
                .leave(leave)
                .attendanceRate(attendanceRate)
                .build();
    }

    public byte[] exportCsv(LocalDate from, LocalDate to, UUID userId) {
        List<Attendance> records;
        if (userId != null) {
            records = attendanceRepository.findByUserIdAndDateBetween(userId, from, to);
        } else {
            records = attendanceRepository.findAll().stream()
                    .filter(a -> !a.getDate().isBefore(from) && !a.getDate().isAfter(to))
                    .toList();
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try (OutputStreamWriter writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {
            writer.write(0xFEFF);
            writer.write("ID,User ID,Employee Code,Date,Check In,Check Out,Status,Late Minutes,Early Minutes,Notes\n");

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            for (Attendance record : records) {
                User user = userRepository.findById(record.getUserId()).orElse(null);
                String employeeCode = user != null ? user.getEmployeeCode() : "";

                StringBuilder line = new StringBuilder();
                line.append(record.getId()).append(",");
                line.append(record.getUserId()).append(",");
                line.append(employeeCode).append(",");
                line.append(record.getDate()).append(",");
                line.append(record.getCheckIn() != null ? record.getCheckIn().atZoneSameInstant(ZoneId.systemDefault()).format(dtf) : "").append(",");
                line.append(record.getCheckOut() != null ? record.getCheckOut().atZoneSameInstant(ZoneId.systemDefault()).format(dtf) : "").append(",");
                line.append(record.getStatus()).append(",");
                line.append(record.getLateMinutes() != null ? record.getLateMinutes() : 0).append(",");
                line.append(record.getEarlyMinutes() != null ? record.getEarlyMinutes() : 0).append(",");
                line.append(record.getNotes() != null ? escapeCsv(record.getNotes()) : "").append("\n");
                writer.write(line.toString());
            }

            writer.flush();
        } catch (IOException e) {
            throw new BadRequestException("Failed to generate CSV: " + e.getMessage());
        }

        return outputStream.toByteArray();
    }

    private String escapeCsv(String value) {
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private AttendanceResponse toResponse(Attendance attendance) {
        User user = userRepository.findById(attendance.getUserId()).orElse(null);
        Shift shift = attendance.getShiftId() != null ? shiftRepository.findById(attendance.getShiftId()).orElse(null) : null;

        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        response.setUserId(attendance.getUserId());
        response.setUserName(user != null ? user.getFullName() : null);
        response.setEmployeeCode(user != null ? user.getEmployeeCode() : null);
        response.setShiftId(attendance.getShiftId());
        response.setShiftName(shift != null ? shift.getName() : null);
        response.setDate(attendance.getDate().toString());
        response.setCheckInTime(attendance.getCheckIn() != null
                ? attendance.getCheckIn().toString() : null);
        response.setCheckOutTime(attendance.getCheckOut() != null
                ? attendance.getCheckOut().toString() : null);
        response.setStatus(attendance.getStatus().name());
        response.setLateMinutes(attendance.getLateMinutes());
        response.setEarlyMinutes(attendance.getEarlyMinutes());
        response.setCheckInLat(attendance.getGpsLat());
        response.setCheckInLng(attendance.getGpsLng());
        response.setCheckOutLat(attendance.getCheckOutLat());
        response.setCheckOutLng(attendance.getCheckOutLng());
        response.setNote(attendance.getNotes());
        response.setCreatedAt(attendance.getCreatedAt() != null
                ? attendance.getCreatedAt().toLocalDateTime() : null);
        response.setUpdatedAt(attendance.getUpdatedAt() != null
                ? attendance.getUpdatedAt().toLocalDateTime() : null);
        return response;
    }
}