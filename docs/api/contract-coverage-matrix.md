# Contract Coverage Matrix - Phần mềm Chấm công

## 1. Requirement to API Mapping

| Requirement ID | Requirement Title | API Endpoints | Coverage |
|----------------|-------------------|---------------|----------|
| REQ-01 | QR Code Attendance (IN/OUT) | POST /attendance/scan, GET /attendance/me | ✅ 100% |
| REQ-02 | Mobile Responsive | All endpoints (client-side) | ✅ 100% |
| REQ-03 | Monthly Report & Salary | GET /reports/monthly, GET /reports/salary | ✅ 100% |
| REQ-04 | Dashboard | GET /attendance, GET /reports/* | ✅ 100% |
| REQ-05 | QR Code Generation | POST /qr/generate, POST /qr/validate | ✅ 100% |
| REQ-06 | GPS Location Verification | POST /attendance/scan (GPS fields) | ✅ 100% |
| REQ-07 | User Authentication | POST /auth/login, POST /auth/logout | ✅ 100% |
| REQ-08 | Salary Configuration | GET/PUT /salary/config/* | ✅ 100% |
| REQ-09 | Shift Configuration | GET/POST /shifts | ✅ 100% |

## 2. Module to API Mapping

| Module ID | Module Name | API Endpoints | Coverage |
|-----------|-------------|---------------|----------|
| MOD-01 | QR Attendance | /attendance/* | ✅ 100% |
| MOD-02 | Mobile Responsive | All endpoints | ✅ 100% |
| MOD-03 | Reports & Salary | /reports/*, /salary/* | ✅ 100% |
| MOD-04 | Dashboard | /attendance, /reports | ✅ 100% |
| MOD-05 | QR Generation | /qr/* | ✅ 100% |
| MOD-06 | GPS Verification | /attendance/scan | ✅ 100% |
| MOD-07 | Authentication | /auth/* | ✅ 100% |
| MOD-08 | User Management | /users/* | ✅ 100% |

## 3. Business Rule to API Mapping

| Rule ID | Rule Name | API Endpoint | Status |
|---------|-----------|--------------|--------|
| BR-M01-01 | QR Code Validity | POST /qr/validate, POST /attendance/scan | ✅ |
| BR-M01-02 | Duplicate Prevention | POST /attendance/scan | ✅ |
| BR-M01-03 | Attendance Type Detection | POST /attendance/scan | ✅ |
| BR-M01-04 | QR Code Display | POST /qr/generate | ✅ |
| BR-M01-05 | GPS Location Verification | POST /attendance/scan | ✅ |
| BR-M01-06 | Attendance Success Condition | POST /attendance/scan | ✅ |
| BR-M01-07 | Response Time & UX | POST /attendance/scan | ✅ |
| BR-M01-08 | Security & Brute Force | POST /auth/login | ✅ |
| BR-M01-09 | Offline & Network | POST /attendance/scan | ✅ |
| BR-M01-10 | Device Compatibility | All endpoints (client) | ✅ |

## 4. Database to API Mapping

| Table | API Endpoints | Operations |
|-------|---------------|------------|
| users | /auth/*, /users/* | CREATE, READ, UPDATE |
| attendance | /attendance/* | CREATE, READ, UPDATE |
| qr_codes | /qr/* | CREATE, READ |
| salary_config | /salary/* | READ, UPDATE |
| shifts | /shifts/* | CREATE, READ, UPDATE, DELETE |
| system_config | /config/* | READ, UPDATE |
| audit_log | (internal) | CREATE |

## 5. Coverage Summary

| Category | Total | Covered | Coverage |
|----------|-------|---------|----------|
| Requirements | 9 | 9 | 100% |
| Modules | 8 | 8 | 100% |
| Business Rules | 10 | 10 | 100% |
| Database Tables | 7 | 7 | 100% |
| API Endpoints | 20 | 20 | 100% |

## 6. Gaps Identified

| Gap | Description | Impact | Resolution |
|-----|-------------|--------|------------|
| GAP-01 | No WebSocket for real-time QR refresh | Medium | Add WebSocket endpoint |
| GAP-02 | No batch attendance import | Low | Future enhancement |
| GAP-03 | No export to Excel/PDF | Low | Add export endpoints |

## 7. Recommendation

All critical requirements have API coverage. Minor gaps can be addressed in future iterations:
1. Add WebSocket for real-time QR refresh (optional)
2. Add batch import for attendance (optional)
3. Add export endpoints for reports (optional)
