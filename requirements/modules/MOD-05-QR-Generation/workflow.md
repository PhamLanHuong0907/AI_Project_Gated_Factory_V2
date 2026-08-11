# MOD-05: QR Code Generation - Workflow

## Main Workflow: Employee Generates QR Code

```mermaid
sequenceDiagram
    participant E as Employee
    participant S as System
    participant DB as Database
    participant QR as QR Generator

    E->>S: Press "Tạo mã QR" button
    S->>S: Check if employee has active QR
    alt Has active QR
        S-->>E: "Bạn đã có mã QR active. Hủy mã cũ?"
        E->>S: Confirm cancel old QR
        S->>DB: Mark old QR as cancelled
    end
    S->>QR: Generate new QR code
    QR-->>S: Return QR data
    S->>DB: Store QR with expiration
    S-->>E: Display QR code on screen
```

## Main Workflow: Work Time Reminder

```mermaid
sequenceDiagram
    participant S as System
    participant DB as Database
    participant E as Employee

    loop Every minute
        S->>DB: Query employees with shift today
        DB-->>S: Return employee list
        loop For each employee
            S->>S: Calculate time to shift start
            S->>DB: Check if employee has active QR
            alt No active QR AND time <= threshold
                S->>E: Send reminder notification
            end
        end
    end
```

## Main Workflow: Employee Views QR Code

```mermaid
sequenceDiagram
    participant E as Employee
    participant S as System
    participant DB as Database

    E->>S: Request own QR code
    S->>DB: Query employee's active QR
    DB-->>S: Return QR code
    S-->>E: Display QR code
```

## Alternative Flows

### AF-01: QR Generation Failure

```mermaid
sequenceDiagram
    participant S as System
    participant QR as QR Generator

    S->>QR: Generate QR code
    QR-->>S: Error: Generation failed
    S->>S: Retry (max 3 times)
    S-->>S: Log failure, notify admin
```

### AF-02: QR Code Expired

```mermaid
sequenceDiagram
    participant S as System
    participant DB as Database

    S->>S: Check QR expiration
    S->>DB: Mark QR as expired
    S->>S: Generate new QR (if auto-renew enabled)
```

### AF-03: QR Code Invalidated

```mermaid
sequenceDiagram
    participant A as Administrator
    participant S as System
    participant DB as Database

    A->>S: Request QR invalidation
    S->>DB: Mark QR as invalid
    S-->>A: Confirmation
```

## Business Rules in Workflow

| Rule | Trigger Point | Action |
|------|---------------|--------|
| BR-09: QR Generation | Generate QR | Create unique code with expiration |
| BR-01: QR Validity | Validate QR | Check expiration and status |

## Error Handling

| Error Type | User Message | System Action |
|------------|--------------|---------------|
| Generation Failed | "Lỗi tạo mã QR" | Retry, log, notify admin |
| QR Expired | "Mã QR đã hết hạn" | Mark expired, generate new |
| QR Invalidated | "Mã QR đã bị vô hiệu hóa" | Log attempt |

## Status Codes

| Code | Meaning |
|------|---------|
| QR_ACTIVE | QR code is active and usable |
| QR_EXPIRED | QR code has expired |
| QR_INVALIDATED | QR code manually invalidated |
| QR_GENERATION_FAILED | Failed to generate QR code |

## Open Questions

| ID | Question |
|----|----------|
| OQ-M05-W01 | What triggers automatic QR generation? |
| OQ-M05-W02 | Can QR codes be regenerated manually? |
| OQ-M05-W03 | Is there QR code history? |
| OQ-M05-W04 | Can QR codes be bulk generated? |
