package com.pas.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "shift_id")
    private UUID shiftId;

    @Column(name = "check_in")
    private OffsetDateTime checkIn;

    @Column(name = "check_out")
    private OffsetDateTime checkOut;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "late_minutes")
    private Integer lateMinutes;

    @Column(name = "early_minutes")
    private Integer earlyMinutes;

    @Column(name = "qr_token", length = 255)
    private String qrToken;

    @Column(name = "gps_lat", precision = 10, scale = 7)
    private BigDecimal gpsLat;

    @Column(name = "gps_lng", precision = 10, scale = 7)
    private BigDecimal gpsLng;

    @Column(name = "check_out_lat", precision = 10, scale = 7)
    private BigDecimal checkOutLat;

    @Column(name = "check_out_lng", precision = 10, scale = 7)
    private BigDecimal checkOutLng;

    @Column(length = 500)
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public enum Status {
        ON_TIME, LATE, ABSENT, ON_LEAVE, EARLY_LEAVE
    }
}
