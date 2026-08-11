# MOD-01: QR Attendance - Workflow

## Main Workflow: Clock IN (with GPS Verification)

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System
    participant DB as Database
    participant GPS as GPS Service

    E->>M: Open attendance app
    M->>GPS: Request GPS location
    GPS-->>M: Return GPS coordinates
    M->>S: Request QR code
    S-->>M: Display QR code
    E->>M: Scan QR code
    M->>S: Send scan data + GPS coordinates
    S->>S: Validate QR code
    S->>S: Calculate GPS distance
    S->>S: Check distance <= 10m
    S->>S: Check duplicate
    S->>DB: Record attendance (IN)
    S-->>M: Success confirmation
    M-->>E: Display clock IN success
```

## Main Workflow: Clock OUT (with GPS Verification)

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System
    participant DB as Database
    participant GPS as GPS Service

    E->>M: Open attendance app
    M->>GPS: Request GPS location
    GPS-->>M: Return GPS coordinates
    M->>S: Request QR code
    S-->>M: Display QR code
    E->>M: Scan QR code
    M->>S: Send scan data + GPS coordinates
    S->>S: Validate QR code
    S->>S: Calculate GPS distance
    S->>S: Check distance <= 10m
    S->>S: Check duplicate
    S->>DB: Record attendance (OUT)
    S-->>M: Success confirmation
    M-->>E: Display clock OUT success
```

## Alternative Flows

### AF-01: Invalid QR Code

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System

    E->>M: Scan QR code
    M->>S: Send scan data
    S->>S: Validate QR code
    S-->>M: Error: Invalid QR
    M-->>E: Display error message
```

### AF-02: Expired QR Code

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System

    E->>M: Scan QR code
    M->>S: Send scan data
    S->>S: Check expiration
    S-->>M: Error: QR expired
    M-->>E: Display error, request new QR
```

### AF-03: GPS Out of Range (NEW)

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System
    participant GPS as GPS Service

    E->>M: Scan QR code
    M->>GPS: Get GPS location
    GPS-->>M: Return coordinates
    M->>S: Send scan + GPS
    S->>S: Validate QR (OK)
    S->>S: Calculate distance
    S-->>M: Error: GPS out of range
    M-->>E: Display "Khoảng cách > 10m, vui lòng di chuyển closer"
```

### AF-04: GPS Unavailable (NEW)

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System

    E->>M: Scan QR code
    M->>M: Try get GPS
    M-->>M: GPS unavailable
    M-->>E: Display "Vui lòng bật GPS"
    E->>M: Enable GPS
    M->>S: Resend scan + GPS
```

### AF-05: Duplicate Scan

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System

    E->>M: Scan QR code
    M->>S: Send scan data
    S->>S: Check last attendance
    S-->>M: Warning: Already clocked
    M-->>E: Display warning, show last record
```

### AF-06: Network Error

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Mobile Device
    participant S as System

    E->>M: Scan QR code
    M->>S: Send scan data
    S-->>M: Network error
    M-->>E: Display error, retry option
    E->>M: Retry
    M->>S: Resend scan data
```

## Business Rules in Workflow

| Rule | Trigger Point | Action |
|------|---------------|--------|
| BR-01: QR Validity | Validate QR code | Reject if invalid/expired |
| BR-03: Duplicate Prevention | Before recording | Check last attendance status |
| BR-08: GPS Verification (NEW) | After QR validation | Calculate distance, reject if > 10m |
| BR-10: Success Condition (NEW) | Final validation | Both QR AND GPS must pass |

## Error Handling

| Error Type | User Message | System Action |
|------------|--------------|---------------|
| Invalid QR | "Mã QR không hợp lệ" | Log attempt |
| Expired QR | "Mã QR đã hết hạn" | Log attempt |
| GPS Out of Range | "Khoảng cách > 10m, vui lòng di chuyển closer" | Log attempt |
| GPS Unavailable | "Vui lòng bật GPS trên thiết bị" | Prompt to enable |
| Duplicate | "Bạn đã chấm công rồi" | Show last record |
| Network Error | "Lỗi kết nối, vui lòng thử lại" | Queue for retry |

## Status Codes

| Code | Meaning |
|------|---------|
| SUCCESS_IN | Clock IN successful |
| SUCCESS_OUT | Clock OUT successful |
| ERROR_INVALID_QR | QR code invalid |
| ERROR_EXPIRED_QR | QR code expired |
| ERROR_GPS_OUT_OF_RANGE | GPS distance > 10m (NEW) |
| ERROR_GPS_UNAVAILABLE | GPS not available (NEW) |
| WARNING_DUPLICATE | Duplicate scan detected |
| ERROR_NETWORK | Network error |

## Open Questions

| ID | Question |
|----|----------|
| OQ-M01-W01 | What is the QR code validity period? |
| OQ-M01-W02 | Is QR code single-use or multi-use? |
| OQ-M01-W03 | What is minimum interval between scans? |
| OQ-M01-W04 | How to handle offline attendance? |
| OQ-M01-W05 | Is manual override possible? |
| OQ-M01-W06 | What happens when GPS is unavailable? (NEW) |
| OQ-M01-W07 | Is GPS accuracy threshold configurable? (NEW) |
| OQ-M01-W08 | Can attendance be recorded if GPS fails but QR is valid? (NEW) |
