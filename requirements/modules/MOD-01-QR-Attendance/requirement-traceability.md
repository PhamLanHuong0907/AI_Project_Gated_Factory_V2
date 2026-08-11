# MOD-01: QR Attendance - Requirement Traceability

## Traceability Matrix

### Source to Module Mapping

| Source Section | Source Text | Requirement ID | Module ID | Status |
|----------------|-------------|----------------|-----------|--------|
| Yêu cầu dự án | "Chấm công bằng mã QR (IN/OUT)" | REQ-01 | MOD-01 | MAPPED |

### Requirement to Feature Mapping

| Requirement ID | Feature ID | Feature Name | Status |
|----------------|------------|--------------|--------|
| REQ-01 | F-01-01 | QR Code Scanning | SPECIFIED |
| REQ-01 | F-01-02 | Attendance Recording | SPECIFIED |
| REQ-01 | F-01-03 | Duplicate Prevention | INFERRED |
| REQ-01 | F-01-04 | QR Code Generation | NOT SPECIFIED |
| REQ-01 | F-01-05 | Attendance History View | NOT SPECIFIED |

### Feature to Business Rule Mapping

| Feature ID | Rule ID | Rule Name | Status |
|------------|---------|-----------|--------|
| F-01-01 | BR-M01-01 | QR Code Validity | NOT SPECIFIED |
| F-01-02 | BR-M01-02 | Duplicate Prevention | INFERRED |
| F-01-02 | BR-M01-03 | Attendance Type Detection | INFERRED |
| F-01-04 | BR-M01-04 | QR Code Display | NOT SPECIFIED |

### Business Rule to Validation Mapping

| Rule ID | Validation ID | Validation Name | Status |
|---------|---------------|-----------------|--------|
| BR-M01-01 | VAL-M01-01 | QR Code Format Validation | INFERRED |
| BR-M01-01 | VAL-M01-02 | QR Code Existence Validation | NOT SPECIFIED |
| BR-M01-01 | VAL-M01-03 | QR Code Expiration Validation | NOT SPECIFIED |
| BR-M01-02 | VAL-M01-05 | Duplicate Attendance Validation | INFERRED |
| BR-M01-03 | VAL-M01-04 | Employee-QR Code Association | NOT SPECIFIED |
| - | VAL-M01-06 | Time Window Validation | NOT SPECIFIED |
| - | VAL-M01-07 | Camera Permission Validation | NOT SPECIFIED |

### Validation to Acceptance Criteria Mapping

| Validation ID | Acceptance Criteria ID | Criteria Name | Status |
|---------------|------------------------|---------------|--------|
| VAL-M01-01 | AC-M01-05 | Invalid QR Code Handling | NOT SPECIFIED |
| VAL-M01-02 | AC-M01-05 | Invalid QR Code Handling | NOT SPECIFIED |
| VAL-M01-03 | AC-M01-06 | Expired QR Code Handling | NOT SPECIFIED |
| VAL-M01-05 | AC-M01-04 | Duplicate Prevention | INFERRED |
| VAL-M01-06 | AC-M01-01 | QR Code Scanning | NOT SPECIFIED |
| VAL-M01-07 | AC-M01-08 | Mobile Responsiveness | SPECIFIED |

### Acceptance Criteria to Test Case Mapping

| Acceptance Criteria ID | Test Case ID | Test Case Name | Status |
|------------------------|--------------|----------------|--------|
| AC-M01-01 | TC-M01-01 | Test QR Code Scanning | NOT SPECIFIED |
| AC-M01-02 | TC-M01-02 | Test Clock IN Recording | NOT SPECIFIED |
| AC-M01-03 | TC-M01-03 | Test Clock OUT Recording | NOT SPECIFIED |
| AC-M01-04 | TC-M01-04 | Test Duplicate Prevention | NOT SPECIFIED |
| AC-M01-05 | TC-M01-05 | Test Invalid QR Handling | NOT SPECIFIED |
| AC-M01-06 | TC-M01-06 | Test Expired QR Handling | NOT SPECIFIED |
| AC-M01-07 | TC-M01-07 | Test Network Error Handling | NOT SPECIFIED |
| AC-M01-08 | TC-M01-08 | Test Mobile Responsiveness | NOT SPECIFIED |

## Traceability Coverage

### Coverage by Level

| Level | Total | Specified | Inferred | Not Specified | Coverage |
|-------|-------|-----------|----------|---------------|----------|
| Source → Requirement | 1 | 1 | 0 | 0 | 100% |
| Requirement → Feature | 5 | 2 | 1 | 2 | 40% |
| Feature → Business Rule | 4 | 0 | 2 | 2 | 50% |
| Business Rule → Validation | 7 | 0 | 2 | 5 | 29% |
| Validation → Acceptance Criteria | 6 | 1 | 1 | 4 | 33% |
| Acceptance Criteria → Test Case | 8 | 0 | 0 | 8 | 0% |

### Overall Coverage

**Total Traceability Links**: 31
**Specified**: 4 (12.9%)
**Inferred**: 6 (19.4%)
**Not Specified**: 21 (67.7%)

## Gap Analysis

### Critical Gaps

1. **QR Code Generation**: No specification for how QR codes are generated
2. **QR Code Validity**: No specification for validity period
3. **Duplicate Prevention Rules**: Only inferred, not explicitly defined
4. **Test Cases**: No test cases defined

### Missing Links

| From | To | Missing |
|------|----|---------|
| REQ-01 | Business Rules | Most rules not specified |
| Business Rules | Validations | Most validations not specified |
| Validations | Acceptance Criteria | Most criteria not specified |
| Acceptance Criteria | Test Cases | All test cases missing |

## Recommendation

Traceability is incomplete. To achieve full traceability:
1. Answer all open questions
2. Define all business rules explicitly
3. Define all validations
4. Write all acceptance criteria
5. Create test cases for all criteria
