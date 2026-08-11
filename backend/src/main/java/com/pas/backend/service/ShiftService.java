package com.pas.backend.service;

import com.pas.backend.dto.shift.ShiftCreateRequest;
import com.pas.backend.dto.shift.ShiftResponse;
import com.pas.backend.dto.shift.ShiftUpdateRequest;
import com.pas.backend.entity.Shift;
import com.pas.backend.exception.BadRequestException;
import com.pas.backend.exception.ResourceNotFoundException;
import com.pas.backend.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShiftService {

    private final ShiftRepository shiftRepository;

    public Page<ShiftResponse> getAllShifts(Pageable pageable, String search) {
        Specification<Shift> spec = Specification.where(null);

        if (search != null && !search.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"));
        }

        return shiftRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public ShiftResponse getShiftById(UUID id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));
        return toResponse(shift);
    }

    @Transactional
    public ShiftResponse createShift(ShiftCreateRequest request) {
        shiftRepository.findByName(request.getName()).ifPresent(s -> {
            throw new BadRequestException("Shift name already exists: " + request.getName());
        });

        Shift shift = Shift.builder()
                .name(request.getName())
                .startTime(LocalTime.parse(request.getStartTime(), DateTimeFormatter.ofPattern("HH:mm")))
                .endTime(LocalTime.parse(request.getEndTime(), DateTimeFormatter.ofPattern("HH:mm")))
                .isActive(request.getActive() != null ? request.getActive() : true)
                .build();

        return toResponse(shiftRepository.save(shift));
    }

    @Transactional
    public ShiftResponse updateShift(UUID id, ShiftUpdateRequest request) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));

        if (request.getName() != null) shift.setName(request.getName());
        if (request.getStartTime() != null) {
            shift.setStartTime(LocalTime.parse(request.getStartTime(), DateTimeFormatter.ofPattern("HH:mm")));
        }
        if (request.getEndTime() != null) {
            shift.setEndTime(LocalTime.parse(request.getEndTime(), DateTimeFormatter.ofPattern("HH:mm")));
        }
        if (request.getActive() != null) shift.setIsActive(request.getActive());

        return toResponse(shiftRepository.save(shift));
    }

    @Transactional
    public void deleteShift(UUID id) {
        if (!shiftRepository.existsById(id)) {
            throw new ResourceNotFoundException("Shift not found with id: " + id);
        }
        shiftRepository.deleteById(id);
    }

    @Transactional
    public ShiftResponse toggleActive(UUID id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));
        shift.setIsActive(!shift.getIsActive());
        return toResponse(shiftRepository.save(shift));
    }

    private ShiftResponse toResponse(Shift shift) {
        ShiftResponse response = new ShiftResponse();
        response.setId(shift.getId());
        response.setName(shift.getName());
        response.setStartTime(shift.getStartTime() != null
                ? shift.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) : null);
        response.setEndTime(shift.getEndTime() != null
                ? shift.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")) : null);
        response.setActive(shift.getIsActive());
        response.setCreatedAt(shift.getCreatedAt() != null
                ? shift.getCreatedAt().toLocalDateTime() : null);
        response.setUpdatedAt(shift.getUpdatedAt() != null
                ? shift.getUpdatedAt().toLocalDateTime() : null);
        return response;
    }
}