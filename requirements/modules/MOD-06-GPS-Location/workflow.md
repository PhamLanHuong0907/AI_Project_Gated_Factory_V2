# MOD-06: GPS Location Verification - Workflow

## Main Workflow: GPS Verification

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System
    participant DB as Database

    E->>M: Scan QR code
    M->>M: Get GPS location
    M->>S: Send scan + GPS coordinates
    S->>DB: Get company GPS location
    DB-->>S: Return company coordinates
    S->>S: Calculate distance (Haversine)
    S->>S: Validate distance <= 10m
    alt Distance <= 10m
        S-->>M: GPS verification PASSED
    else Distance > 10m
        S-->>M: GPS verification FAILED
        M-->>E: Display distance and error
    end
```

## Alternative Flows

### AF-01: GPS Unavailable

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System

    E->>M: Scan QR code
    M->>M: Try get GPS location
    M-->>M: GPS unavailable
    M-->>E: Display "Vui lòng bật GPS"
    E->>M: Enable GPS
    M->>S: Resend scan + GPS
```

### AF-02: GPS Accuracy Low

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System

    E->>M: Scan QR code
    M->>M: Get GPS location
    M-->>M: Low accuracy warning
    M-->>E: Display "GPS chính xác thấp"
    M->>S: Send scan + GPS (with accuracy)
    S->>S: Check accuracy threshold
    alt Accuracy acceptable
        S-->>M: GPS verification PASSED (with warning)
    else Accuracy not acceptable
        S-->>M: GPS verification FAILED
    end
```

### AF-03: Company GPS Not Configured

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System
    participant DB as Database

    E->>M: Scan QR code
    M->>S: Send scan + GPS
    S->>DB: Get company GPS
    DB-->>S: GPS not configured
    S-->>M: Error: Company GPS not configured
    M-->>E: Display error
```

## Business Rules in Workflow

| Rule | Trigger Point | Action |
|------|---------------|--------|
| BR-08: GPS Verification | After QR validation | Calculate distance, validate ≤ 10m |
| BR-10: Success Condition | Final validation | Both QR AND GPS must pass |

## Error Handling

| Error Type | User Message | System Action |
|------------|--------------|---------------|
| GPS Unavailable | "Vui lòng bật GPS trên thiết bị" | Prompt to enable |
| GPS Out of Range | "Khoảng cách {distance}m > 10m" | Show distance, reject |
| GPS Inaccurate | "GPS chính xác thấp" | Warn user |
| Company GPS Missing | "Chưa cấu hình vị trí công ty" | Notify admin |

## Status Codes

| Code | Meaning |
|------|---------|
| GPS_VALID | Distance ≤ 10m |
| GPS_INVALID | Distance > 10m |
| GPS_UNAVAILABLE | GPS not available |
| GPS_INACCURATE | GPS accuracy low |
| COMPANY_GPS_MISSING | Company GPS not configured |

## Open Questions

| ID | Question |
|----|----------|
| OQ-M06-W01 | What is GPS accuracy threshold? |
| OQ-M06-W02 | Can manual override bypass GPS? |
| OQ-M06-W03 | How to handle multi-location? |
| OQ-M06-W04 | Is GPS caching allowed? |
