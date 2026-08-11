# MOD-07: Authentication - Permissions

## Permission Matrix

| Permission | Employee | Administrator | System | Status |
|------------|----------|---------------|--------|--------|
| Login | ✅ ALLOW | ✅ ALLOW | ❌ DENY | SPECIFIED |
| Logout | ✅ ALLOW | ✅ ALLOW | ❌ DENY | SPECIFIED |
| View Own Session | ✅ ALLOW | ❌ DENY | ❌ DENY | SPECIFIED |
| View All Sessions | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |
| Invalidate Session | ❌ DENY | ✅ ALLOW | ✅ ALLOW | SPECIFIED |
| Lock Account | ❌ DENY | ✅ ALLOW | ✅ ALLOW | SPECIFIED |
| Unlock Account | ❌ DENY | ✅ ALLOW | ❌ DENY | SPECIFIED |

## Open Questions

| ID | Question |
|----|----------|
| OQ-M07-P01 | Can users have multiple sessions? |
| OQ-M07-P02 | Can admin force logout all users? |
| OQ-M07-P03 | Is session activity logged? |
