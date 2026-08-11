# MOD-06: GPS Location Verification - Permissions

## Permission Matrix

| Permission | Employee | Administrator | System | Status |
|------------|----------|---------------|--------|--------|
| Get GPS Location | ✅ ALLOW | ❌ DENY | ✅ ALLOW | SPECIFIED |
| View Own Location | ✅ ALLOW | ❌ DENY | ❌ DENY | SPECIFIED |
| View All Locations | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |
| Configure Company GPS | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |
| Override GPS Validation | ❌ DENY | ⚠️ TBD | ❌ DENY | NOT SPECIFIED |
| View GPS Logs | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |

## Open Questions

| ID | Question |
|----|----------|
| OQ-M06-P01 | Can admin override GPS validation? |
| OQ-M06-P02 | Is there GPS audit trail? |
| OQ-M06-P03 | Can employees view their GPS history? |
