# MOD-03: Reports - Workflow

## Main Workflow: Generate Monthly Report

```mermaid
sequenceDiagram
    participant A as Administrator
    participant S as System
    participant DB as Database
    participant R as Report Engine

    A->>S: Request monthly report
    S->>DB: Query attendance data
    DB-->>S: Return attendance records
    S->>R: Generate report
    R->>R: Calculate statistics
    R-->>S: Return report
    S-->>A: Display report
    A->>S: Export report (optional)
    S-->>A: Download file
```

## Alternative Flows

### AF-01: No Data Available

```mermaid
sequenceDiagram
    participant A as Administrator
    participant S as System

    A->>S: Request monthly report
    S->>S: Check data existence
    S-->>A: Display "No data available"
```

### AF-02: Export Report

```mermaid
sequenceDiagram
    participant A as Administrator
    participant S as System

    A->>S: Click export
    S->>S: Generate file
    S-->>A: Download file
```

## Open Questions

| ID | Question |
|----|----------|
| OQ-M03-W01 | What export formats are supported? |
| OQ-M03-W02 | Can reports be scheduled? |
| OQ-M03-W03 | Is there report caching? |
| OQ-M03-W04 | Can reports be emailed? |
