-- ============================================================================
-- V2__seed_data.sql
-- Precision Attendance System - Seed Data
-- ============================================================================

-- ============================================================================
-- 1. Users (3 accounts)
-- Passwords are bcrypt hashed (10 rounds):
--   admin      / admin123
--   hr_manager / hr123456
--   employee   / emp123456
-- ============================================================================
INSERT INTO users (id, employee_code, email, password_hash, full_name, phone, role, department, position, is_active)
VALUES
    (
        'a0000000-0000-0000-0000-000000000001'::UUID,
        'EMP001',
        'admin@pas.vn',
        '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Kz2G3kFALYkIiRmPNvCO2',
        'System Administrator',
        '0901000001',
        'ADMIN',
        'IT',
        'System Admin',
        TRUE
    ),
    (
        'a0000000-0000-0000-0000-000000000002'::UUID,
        'EMP002',
        'hr.manager@pas.vn',
        '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Kz2G3kFALYkIiRmPNvCO2',
        'Nguyen Thi HR Manager',
        '0901000002',
        'HR_MANAGER',
        'Human Resources',
        'HR Manager',
        TRUE
    ),
    (
        'a0000000-0000-0000-0000-000000000003'::UUID,
        'EMP003',
        'employee@pas.vn',
        '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Kz2G3kFALYkIiRmPNvCO2',
        'Tran Van Employee',
        '0901000003',
        'EMPLOYEE',
        'Engineering',
        'Software Engineer',
        TRUE
    );

-- ============================================================================
-- 2. Shifts (3 shifts)
-- ============================================================================
INSERT INTO shifts (id, name, start_time, end_time, is_active)
VALUES
    (
        'b0000000-0000-0000-0000-000000000001'::UUID,
        'Morning Shift',
        '07:00:00',
        '12:00:00',
        TRUE
    ),
    (
        'b0000000-0000-0000-0000-000000000002'::UUID,
        'Afternoon Shift',
        '13:00:00',
        '18:00:00',
        TRUE
    ),
    (
        'b0000000-0000-0000-0000-000000000003'::UUID,
        'Full-Day Shift',
        '07:00:00',
        '18:00:00',
        TRUE
    );

-- ============================================================================
-- 3. Default Config - GPS (Factory location)
-- ============================================================================
INSERT INTO config_gps (id, latitude, longitude, radius, address, is_active)
VALUES
    (
        'c0000000-0000-0000-0000-000000000001'::UUID,
        10.762622,
        106.660172,
        100.00,
        'Precision Factory - Ho Chi Minh City',
        TRUE
    );

-- ============================================================================
-- 4. Default Config - QR Expiry
-- ============================================================================
INSERT INTO config_qr (id, expiry_minutes, is_active)
VALUES
    (
        'd0000000-0000-0000-0000-000000000001'::UUID,
        5,
        TRUE
    );

-- ============================================================================
-- 5. Default Config - Attendance Threshold
-- ============================================================================
INSERT INTO config_attendance (id, late_threshold_minutes, is_active)
VALUES
    (
        'e0000000-0000-0000-0000-000000000001'::UUID,
        15,
        TRUE
    );

-- Salary configurations and assignments have been removed (mock data cleared).
