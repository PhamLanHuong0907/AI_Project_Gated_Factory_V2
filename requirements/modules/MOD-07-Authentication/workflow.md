# MOD-07: Authentication - Workflow

## Main Workflow: User Login

```mermaid
sequenceDiagram
    participant U as User
    participant S as System
    participant DB as Database

    U->>S: Enter username/password
    S->>DB: Query user credentials
    DB-->>S: Return user data
    S->>S: Validate password hash
    alt Login Success
        S->>S: Create session
        S-->>U: Login successful, show dashboard
    else Login Failed
        S-->>U: Error: Invalid credentials
    end
```

## Main Workflow: User Logout

```mermaid
sequenceDiagram
    participant U as User
    participant S as System

    U->>S: Click logout
    S->>S: Invalidate session
    S-->>U: Redirect to login page
```

## Alternative Flows

### AF-01: Invalid Credentials

```mermaid
sequenceDiagram
    participant U as User
    participant S as System

    U->>S: Enter wrong credentials
    S->>S: Increment failed attempts
    alt Max attempts reached
        S-->>U: Account locked
    else Below max
        S-->>U: Error: Invalid credentials
    end
```

### AF-02: Session Expired

```mermaid
sequenceDiagram
    participant U as User
    participant S as System

    U->>S: Try access protected resource
    S->>S: Check session
    S-->>U: Session expired, redirect to login
```

## Business Rules in Workflow

| Rule | Trigger Point | Action |
|------|---------------|--------|
| BR-11: Authentication | Login | Validate credentials |
| Session Management | After login | Create/invalidate session |

## Error Handling

| Error Type | User Message | System Action |
|------------|--------------|---------------|
| Invalid Credentials | "Tên đăng nhập hoặc mật khẩu không đúng" | Log attempt |
| Account Locked | "Tài khoản đã bị khóa" | Notify admin |
| Session Expired | "Phiên đã hết hạn, vui lòng đăng nhập lại" | Clear session |

## Status Codes

| Code | Meaning |
|------|---------|
| LOGIN_SUCCESS | Login successful |
| LOGIN_FAILED | Invalid credentials |
| ACCOUNT_LOCKED | Account locked |
| SESSION_EXPIRED | Session expired |
| LOGOUT_SUCCESS | Logout successful |

## Open Questions

| ID | Question |
|----|----------|
| OQ-M07-W01 | What is session timeout? |
| OQ-M07-W02 | Is remember me feature required? |
| OQ-M07-W03 | Is password reset required? |
