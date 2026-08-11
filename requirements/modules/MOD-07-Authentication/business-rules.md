# MOD-07: Authentication - Business Rules

## Business Rules

### BR-M07-01: User Login

| Field | Value |
|-------|-------|
| Rule ID | BR-M07-01 |
| Rule Name | User Login |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Users login with personal account (username/password).

**Logic**:
```
user = find_user(username)
IF user IS NULL THEN
    RETURN ERROR_INVALID_CREDENTIALS
END IF

IF verify_password(password, user.password_hash) == FALSE THEN
    increment_failed_attempts(user.id)
    RETURN ERROR_INVALID_CREDENTIALS
END IF

IF user.is_locked THEN
    RETURN ERROR_ACCOUNT_LOCKED
END IF

session = create_session(user)
RETURN LOGIN_SUCCESS
```

**Validation**:
- Username exists in system
- Password matches hash
- Account is not locked

---

### BR-M07-02: Session Management

| Field | Value |
|-------|-------|
| Rule ID | BR-M07-02 |
| Rule Name | Session Management |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Manage user sessions after login.

**Logic**:
```
session = {
    session_id: generate_uuid(),
    user_id: user.id,
    created_at: current_time,
    expires_at: current_time + timeout_duration,
    is_active: true
}
```

**Validation**:
- Session ID is unique
- Expiration time is set
- Session is active

---

### BR-M07-03: Account Lockout

| Field | Value |
|-------|-------|
| Rule ID | BR-M07-03 |
| Rule Name | Account Lockout |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Lock account after multiple failed login attempts.

**Logic**:
```
failed_attempts = get_failed_attempts(user.id)
IF failed_attempts >= max_attempts THEN
    lock_account(user.id)
    notify_admin(user.id)
END IF
```

**Open Questions**:
- How many failed attempts before lockout?
- How long is account locked?
- Can admin unlock manually?

---

### BR-M07-04: Password Policy

| Field | Value |
|-------|-------|
| Rule ID | BR-M07-04 |
| Rule Name | Password Policy |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Define password complexity requirements.

**Open Questions**:
- Minimum password length?
- Required character types?
- Password expiration?
- Password history?

---

## Summary

| Rule | Status | Key Requirement |
|------|--------|-----------------|
| BR-M07-01: User Login | SPECIFIED | Username/password validation |
| BR-M07-02: Session Management | SPECIFIED | Create/invalidate sessions |
| BR-M07-03: Account Lockout | NOT SPECIFIED | Failed attempt handling |
| BR-M07-04: Password Policy | NOT SPECIFIED | Password complexity |
