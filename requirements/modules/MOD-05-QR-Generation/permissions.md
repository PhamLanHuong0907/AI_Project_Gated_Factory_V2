# MOD-05: QR Code Generation - Permissions

## Permission Matrix

| Permission | Employee | Administrator | System | Status |
|------------|----------|---------------|--------|--------|
| Generate QR (Auto) | ❌ DENY | ❌ DENY | ✅ ALLOW | SPECIFIED |
| Generate QR (Manual) | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |
| View Own QR | ✅ ALLOW | ❌ DENY | ❌ DENY | SPECIFIED |
| View All QR | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |
| Print QR | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |
| Invalidate QR | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |

## Open Questions

| ID | Question |
|----|----------|
| OQ-M05-P01 | Can employees view QR codes for others? |
| OQ-M05-P02 | Can multiple admins generate QR codes? |
| OQ-M05-P03 | Is there QR code approval workflow? |
