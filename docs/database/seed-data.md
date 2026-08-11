# Seed Data - Phần mềm Chấm công

## 1. Seed Data Overview

| Category | Records | Purpose |
|----------|---------|---------|
| System Config | 15 | Default system settings |
| Shifts | 3 | Default work shifts |
| Users | 3 | Admin + test employees |
| Salary Config | 3 | Test salary configurations |

## 2. System Configuration

```sql
-- System Configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
-- GPS Settings
('gps.threshold.meters', '50', 'GPS distance threshold in meters (20-50m recommended for indoor)'),
('gps.wifi.fallback', 'true', 'Allow WiFi fallback for GPS'),

-- QR Code Settings
('qr.refresh.interval.seconds', '30', 'QR code auto-refresh interval (15-30 seconds)'),
('qr.validity.minutes', '30', 'QR code validity period'),

-- Attendance Settings
('attendance.min.interval.minutes', '2', 'Minimum interval between scans (1-3 minutes)'),
('attendance.grace.period.minutes', '15', 'Grace period for late arrival (5-15 minutes)'),
('attendance.auto.out.hour', '23', 'Auto OUT hour (23:59)'),
('attendance.auto.out.minute', '59', 'Auto OUT minute'),

-- Security Settings
('security.max.failed.attempts', '5', 'Max failed login attempts before lockout'),
('security.lockout.duration.minutes', '5', 'Account lockout duration'),
('security.jwt.expiration.hours', '24', 'JWT token expiration'),
('security.password.min.length', '8', 'Minimum password length'),

-- Salary Settings
('salary.default.late.penalty', '10000', 'Default penalty per minute late (VND)'),
('salary.default.leave.penalty', '500000', 'Default penalty per day leave (VND)');

-- Company Location
INSERT INTO system_config (config_key, config_value, description) VALUES
('company.gps.lat', '10.762622', 'Company GPS latitude (Ho Chi Minh City)'),
('company.gps.lng', '106.660172', 'Company GPS longitude'),
('company.name', 'Công ty ABC', 'Company name');
```

## 3. Default Shifts

```sql
-- Default Work Shifts
INSERT INTO shifts (name, start_time, end_time, grace_period, work_days, is_active) VALUES
('Ca sáng', '08:00:00', '17:00:00', 15, '1,2,3,4,5', true),
('Ca chiều', '13:00:00', '22:00:00', 15, '1,2,3,4,5', true),
('Ca linh hoạt', '08:00:00', '17:00:00', 30, '1,2,3,4,5,6', true);
```

## 4. Default Users

```sql
-- Admin User (password: Admin@123)
INSERT INTO users (username, password, full_name, email, role, status) VALUES
('admin', '$2a$12$LJ3m4ys3Lz0wqV9rK5e5xuQxQxQxQxQxQxQxQxQxQxQxQxQxQx', 'Quản trị viên', 'admin@company.com', 'ADMIN', 'ACTIVE');

-- HR Manager (password: HR@123)
INSERT INTO users (username, password, full_name, email, role, shift_id, status) VALUES
('hr_manager', '$2a$12$LJ3m4ys3Lz0wqV9rK5e5xuQxQxQxQxQxQxQxQxQxQxQxQxQxQx', 'Nhân viên HR', 'hr@company.com', 'HR_MANAGER', 1, 'ACTIVE');

-- Test Employee (password: Employee@123)
INSERT INTO users (username, password, full_name, email, role, shift_id, status) VALUES
('employee01', '$2a$12$LJ3m4ys3Lz0wqV9rK5e5xuQxQxQxQxQxQxQxQxQxQxQxQxQxQx', 'Nguyễn Văn A', 'employee01@company.com', 'EMPLOYEE', 1, 'ACTIVE');

-- Note: Passwords are BCrypt hashed. Use the following to generate:
-- BCrypt.hashpw("Admin@123", BCrypt.gensalt(12))
```

## 5. Salary Configuration

```sql
-- Default Salary Configurations
INSERT INTO salary_config (user_id, category, base_salary, late_penalty_rate, leave_penalty_rate) VALUES
(3, 'Nhân viên', 10000000.00, 10000.00, 500000.00),
(2, 'Quản lý', 15000000.00, 15000.00, 750000.00),
(1, 'Admin', 20000000.00, 0.00, 0.00);
```

## 6. Seed Data Summary

| Table | Records | Description |
|-------|---------|-------------|
| system_config | 18 | System settings + company location |
| shifts | 3 | Default work shifts |
| users | 3 | Admin, HR, Employee |
| salary_config | 3 | Salary for each user |

## 7. Notes

1. **Passwords**: All passwords in seed data are BCrypt hashed with work factor 12
2. **GPS Coordinates**: Default location is Ho Chi Minh City (update for actual company)
3. **Salary Amounts**: Default amounts in VND (Vietnamese Dong)
4. **Shifts**: 3 default shifts covering common work patterns
5. **Configuration**: All values are configurable via Admin panel
