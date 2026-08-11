package com.pas.backend.service;

import com.pas.backend.dto.config.*;
import com.pas.backend.entity.ConfigAttendance;
import com.pas.backend.entity.ConfigGps;
import com.pas.backend.entity.ConfigQr;
import com.pas.backend.exception.ResourceNotFoundException;
import com.pas.backend.repository.ConfigAttendanceRepository;
import com.pas.backend.repository.ConfigGpsRepository;
import com.pas.backend.repository.ConfigQrRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConfigService {

    private final ConfigGpsRepository configGpsRepository;
    private final ConfigQrRepository configQrRepository;
    private final ConfigAttendanceRepository configAttendanceRepository;

    // ========== GPS Configuration ==========

    public ConfigGpsResponse getGpsConfig() {
        ConfigGps config = configGpsRepository.findFirstByIsActiveTrue()
                .orElseThrow(() -> new ResourceNotFoundException("GPS configuration not found"));
        return toGpsResponse(config);
    }

    @Transactional
    public ConfigGpsResponse updateGpsConfig(ConfigGpsRequest request) {
        ConfigGps config = configGpsRepository.findFirstByIsActiveTrue().orElse(null);

        if (config == null) {
            config = ConfigGps.builder()
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .radius(request.getRadius())
                    .address(request.getAddress())
                    .isActive(request.getActive() != null ? request.getActive() : true)
                    .build();
        } else {
            config.setLatitude(request.getLatitude());
            config.setLongitude(request.getLongitude());
            config.setRadius(request.getRadius());
            if (request.getAddress() != null) config.setAddress(request.getAddress());
            if (request.getActive() != null) config.setIsActive(request.getActive());
        }

        return toGpsResponse(configGpsRepository.save(config));
    }

    // ========== QR Configuration ==========

    public ConfigQrResponse getQrConfig() {
        ConfigQr config = configQrRepository.findFirstByIsActiveTrue()
                .orElseThrow(() -> new ResourceNotFoundException("QR configuration not found"));
        return toQrResponse(config);
    }

    @Transactional
    public ConfigQrResponse updateQrConfig(ConfigQrRequest request) {
        ConfigQr config = configQrRepository.findFirstByIsActiveTrue().orElse(null);

        if (config == null) {
            config = ConfigQr.builder()
                    .expiryMinutes(request.getExpiryMinutes())
                    .isActive(request.getActive() != null ? request.getActive() : true)
                    .build();
        } else {
            config.setExpiryMinutes(request.getExpiryMinutes());
            if (request.getActive() != null) config.setIsActive(request.getActive());
        }

        return toQrResponse(configQrRepository.save(config));
    }

    // ========== Attendance Configuration ==========

    public ConfigAttendanceResponse getAttendanceConfig() {
        ConfigAttendance config = configAttendanceRepository.findFirstByIsActiveTrue()
                .orElseThrow(() -> new ResourceNotFoundException("Attendance configuration not found"));
        return toAttendanceResponse(config);
    }

    @Transactional
    public ConfigAttendanceResponse updateAttendanceConfig(ConfigAttendanceRequest request) {
        ConfigAttendance config = configAttendanceRepository.findFirstByIsActiveTrue().orElse(null);

        if (config == null) {
            config = ConfigAttendance.builder()
                    .lateThresholdMinutes(request.getLateThresholdMinutes())
                    .isActive(request.getActive() != null ? request.getActive() : true)
                    .build();
        } else {
            config.setLateThresholdMinutes(request.getLateThresholdMinutes());
            if (request.getActive() != null) config.setIsActive(request.getActive());
        }

        return toAttendanceResponse(configAttendanceRepository.save(config));
    }

    // ========== Mapping helpers ==========

    private ConfigGpsResponse toGpsResponse(ConfigGps config) {
        ConfigGpsResponse response = new ConfigGpsResponse();
        response.setId(config.getId());
        response.setLatitude(config.getLatitude());
        response.setLongitude(config.getLongitude());
        response.setRadius(config.getRadius());
        response.setAddress(config.getAddress());
        response.setActive(config.getIsActive());
        response.setCreatedAt(config.getCreatedAt() != null
                ? config.getCreatedAt().toLocalDateTime() : null);
        response.setUpdatedAt(config.getUpdatedAt() != null
                ? config.getUpdatedAt().toLocalDateTime() : null);
        return response;
    }

    private ConfigQrResponse toQrResponse(ConfigQr config) {
        ConfigQrResponse response = new ConfigQrResponse();
        response.setId(config.getId());
        response.setExpiryMinutes(config.getExpiryMinutes());
        response.setActive(config.getIsActive());
        response.setCreatedAt(config.getCreatedAt() != null
                ? config.getCreatedAt().toLocalDateTime() : null);
        response.setUpdatedAt(config.getUpdatedAt() != null
                ? config.getUpdatedAt().toLocalDateTime() : null);
        return response;
    }

    private ConfigAttendanceResponse toAttendanceResponse(ConfigAttendance config) {
        ConfigAttendanceResponse response = new ConfigAttendanceResponse();
        response.setId(config.getId());
        response.setLateThresholdMinutes(config.getLateThresholdMinutes());
        response.setActive(config.getIsActive());
        response.setCreatedAt(config.getCreatedAt() != null
                ? config.getCreatedAt().toLocalDateTime() : null);
        response.setUpdatedAt(config.getUpdatedAt() != null
                ? config.getUpdatedAt().toLocalDateTime() : null);
        return response;
    }
}