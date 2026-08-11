# MOD-02: Mobile Responsive - Acceptance Criteria

## Acceptance Criteria

### AC-M02-01: Mobile Layout

| Field | Value |
|-------|-------|
| Criteria ID | AC-M02-01 |
| Feature | Mobile Layout |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: Employee accesses system via mobile device
**When**: Page loads
**Then**:
- Layout adapts to screen size
- Content is readable without zoom
- Navigation is accessible

**Acceptance Criteria**:
- [ ] Works on 320px width
- [ ] Works on 768px width
- [ ] No horizontal scrolling
- [ ] Text is readable

### AC-M02-02: QR Scanner on Mobile

| Field | Value |
|-------|-------|
| Criteria ID | AC-M02-02 |
| Feature | QR Scanner on Mobile |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: Employee on mobile device
**When**: Employee initiates QR scan
**Then**:
- Camera permission requested
- QR scanner opens
- Scan completes successfully

**Acceptance Criteria**:
- [ ] Camera permission requested
- [ ] Scanner works on iOS
- [ ] Scanner works on Android
- [ ] Scan completes in < 3 seconds

## Open Questions

| ID | Question |
|----|----------|
| OQ-M02-AC01 | What browsers are supported? |
| OQ-M02-AC02 | Is offline mode required? |
| OQ-M02-AC03 | What is minimum device requirement? |
