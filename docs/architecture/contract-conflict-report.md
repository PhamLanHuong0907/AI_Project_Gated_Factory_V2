# Contract Conflict Report - Phần mềm Chấm công

## 1. Conflict Summary

| Status | Count |
|--------|-------|
| Resolved | 5 |
| Deferred | 2 |
| Blocked | 0 |

## 2. Resolved Conflicts

### CONFLICT-001: GPS Threshold Value

| Field | Value |
|-------|-------|
| ID | CONFLICT-001 |
| Status | RESOLVED |
| Priority | HIGH |
| Modules | MOD-01, MOD-06 |

**Description**: Original requirement stated GPS threshold ≤ 10m, but stakeholder clarified 20-50m is more realistic for indoor environments.

**Resolution**: 
- Default threshold: 50m (configurable)
- WiFi fallback option enabled
- Configurable via Admin panel

---

### CONFLICT-002: QR Code Generation Method

| Field | Value |
|-------|-------|
| ID | CONFLICT-002 |
| Status | RESOLVED |
| Priority | HIGH |
| Modules | MOD-05 |

**Description**: Original requirement implied automatic QR generation, but stakeholder clarified it should be user-initiated (button press).

**Resolution**:
- Employee presses button to generate QR
- Validity based on configuration
- System reminds if approaching work time

---

### CONFLICT-003: Attendance Type Detection

| Field | Value |
|-------|-------|
| ID | CONFLICT-003 |
| Status | RESOLVED |
| Priority | HIGH |
| Modules | MOD-01 |

**Description**: Unclear whether IN/OUT type should be auto-detected or user-selected.

**Resolution**:
- Auto-detect based on last attendance
- Only first IN per day recorded
- Auto-OUT at 23:59 if forgotten

---

### CONFLICT-004: Offline Support

| Field | Value |
|-------|-------|
| ID | CONFLICT-004 |
| Status | RESOLVED |
| Priority | HIGH |
| Modules | MOD-01 |

**Description**: Offline attendance could enable GPS/time spoofing.

**Resolution**:
- No offline support for GPS-based attendance
- Must have network for server time
- Prevents time/location manipulation

---

### CONFLICT-005: Multi-Tenant vs Single-Tenant

| Field | Value |
|-------|-------|
| ID | CONFLICT-005 |
| Status | RESOLVED |
| Priority | MEDIUM |
| Modules | All |

**Description**: System architecture needed to support single or multiple companies.

**Resolution**:
- Single tenant for v1
- Multi-tenant support deferred to v2
- Simplifies data model and deployment

---

## 3. Deferred Conflicts

### CONFLICT-006: WebSocket for Real-Time QR

| Field | Value |
|-------|-------|
| ID | CONFLICT-006 |
| Status | DEFERRED |
| Priority | MEDIUM |
| Modules | MOD-05 |

**Description**: QR code auto-refresh could use polling or WebSocket.

**Resolution**: 
- Use polling (15-30 second intervals) for v1
- WebSocket considered for v2 if performance issues

---

### CONFLICT-007: Export Format

| Field | Value |
|-------|-------|
| ID | CONFLICT-007 |
| Status | DEFERRED |
| Priority | LOW |
| Modules | MOD-03 |

**Description**: Report export format (PDF, Excel, CSV) not specified.

**Resolution**:
- CSV export for v1 (simplest)
- PDF/Excel export for v2

---

## 4. No Blocked Conflicts

All critical conflicts have been resolved. No blockers for implementation.

## 5. Conflict Resolution Principles

| Principle | Application |
|-----------|-------------|
| Security First | No offline support, server time only |
| User Experience | Haptic feedback, clear error messages |
| Configurability | GPS threshold, grace periods configurable |
| Simplicity | Single tenant, polling over WebSocket |
| Fraud Prevention | Dynamic QR, GPS verification required |

## 6. Recommendations

1. Proceed with implementation - all critical conflicts resolved
2. Monitor GPS threshold in production and adjust if needed
3. Gather user feedback on QR refresh interval
4. Plan WebSocket implementation for v2 if needed
