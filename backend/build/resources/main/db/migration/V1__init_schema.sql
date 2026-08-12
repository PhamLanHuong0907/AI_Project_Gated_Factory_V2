-- ============================================================================
-- V1__init_schema.sql
-- Precision Attendance System - Initial Schema
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. users
-- ============================================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_code   VARCHAR(20)   NOT NULL,
    email           VARCHAR(100)  NOT NULL,
    password_hash   VARCHAR(255)  NOT NULL,
    full_name       VARCHAR(100)  NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20)   NOT NULL DEFAULT 'EMPLOYEE',
    department      VARCHAR(100),
    position        VARCHAR(100),
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_users_employee_code UNIQUE (employee_code),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT ck_users_role CHECK (role IN ('ADMIN', 'HR_MANAGER', 'EMPLOYEE'))
);

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_department ON users (department);
CREATE INDEX idx_users_is_active ON users (is_active);

-- ============================================================================
-- 2. shifts
-- ============================================================================
CREATE TABLE shifts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)  NOT NULL,
    start_time      TIME          NOT NULL,
    end_time        TIME          NOT NULL,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_shifts_name UNIQUE (name),
    CONSTRAINT ck_shifts_time_order CHECK (start_time < end_time)
);

CREATE INDEX idx_shifts_is_active ON shifts (is_active);

-- ============================================================================
-- 3. attendance
-- ============================================================================
CREATE TABLE attendance (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID          NOT NULL,
    check_in        TIMESTAMP,
    check_out       TIMESTAMP,
    date            DATE          NOT NULL DEFAULT CURRENT_DATE,
    status          VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    late_minutes    INTEGER       NOT NULL DEFAULT 0,
    early_minutes   INTEGER       NOT NULL DEFAULT 0,
    qr_token        VARCHAR(255),
    gps_lat         DECIMAL(10, 8),
    gps_lng         DECIMAL(11, 8),
    notes           TEXT,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_attendance_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT ck_attendance_status CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EARLY_LEAVE', 'ON_LEAVE', 'PENDING')),
    CONSTRAINT uq_attendance_user_date UNIQUE (user_id, date)
);

CREATE INDEX idx_attendance_user ON attendance (user_id);
CREATE INDEX idx_attendance_date ON attendance (date);
CREATE INDEX idx_attendance_status ON attendance (status);

-- ============================================================================
-- 4. leave_requests
-- ============================================================================
CREATE TABLE leave_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID          NOT NULL,
    leave_date      DATE          NOT NULL,
    reason          TEXT          NOT NULL,
    status          VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    attachment_urls JSONB         NOT NULL DEFAULT '[]'::JSONB,
    reviewed_by     UUID,
    reviewed_at     TIMESTAMP,
    reject_reason   TEXT,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_leave_requests_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_leave_requests_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT ck_leave_requests_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

CREATE INDEX idx_leave_requests_user ON leave_requests (user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests (status);
CREATE INDEX idx_leave_requests_date ON leave_requests (leave_date);

-- ============================================================================
-- 5. salary_positions
-- ============================================================================
CREATE TABLE salary_positions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)  NOT NULL,
    base_salary     DECIMAL(15, 2) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_salary_positions_name UNIQUE (name),
    CONSTRAINT ck_salary_positions_base_salary CHECK (base_salary >= 0)
);

CREATE INDEX idx_salary_positions_is_active ON salary_positions (is_active);

-- ============================================================================
-- 6. salary_experience
-- ============================================================================
CREATE TABLE salary_experience (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)  NOT NULL,
    percentage      DECIMAL(5, 2) NOT NULL DEFAULT 0,
    min_years       INTEGER       NOT NULL DEFAULT 0,
    max_years       INTEGER,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT ck_salary_experience_min_years CHECK (min_years >= 0),
    CONSTRAINT ck_salary_experience_max_years CHECK (max_years IS NULL OR max_years >= min_years),
    CONSTRAINT ck_salary_experience_percentage CHECK (percentage >= 0)
);

CREATE INDEX idx_salary_experience_is_active ON salary_experience (is_active);

-- ============================================================================
-- 7. salary_penalties
-- ============================================================================
CREATE TABLE salary_penalties (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)  NOT NULL,
    penalty_type    VARCHAR(20)   NOT NULL,
    amount          DECIMAL(15, 2) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_salary_penalties_name UNIQUE (name),
    CONSTRAINT ck_salary_penalties_type CHECK (penalty_type IN ('LATE', 'ABSENT', 'EARLY_LEAVE')),
    CONSTRAINT ck_salary_penalties_amount CHECK (amount >= 0)
);

CREATE INDEX idx_salary_penalties_type ON salary_penalties (penalty_type);
CREATE INDEX idx_salary_penalties_is_active ON salary_penalties (is_active);

-- ============================================================================
-- 8. salary_bonus
-- ============================================================================
CREATE TABLE salary_bonus (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)  NOT NULL,
    bonus_type      VARCHAR(50)   NOT NULL,
    amount          DECIMAL(15, 2) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_salary_bonus_name UNIQUE (name),
    CONSTRAINT ck_salary_bonus_amount CHECK (amount >= 0)
);

CREATE INDEX idx_salary_bonus_type ON salary_bonus (bonus_type);
CREATE INDEX idx_salary_bonus_is_active ON salary_bonus (is_active);

-- ============================================================================
-- 9. emp_salary_position
-- ============================================================================
CREATE TABLE emp_salary_position (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID          NOT NULL,
    position_id     UUID          NOT NULL,
    assigned_at     TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_esp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_esp_position FOREIGN KEY (position_id) REFERENCES salary_positions (id) ON DELETE RESTRICT,
    CONSTRAINT uq_esp_user_position UNIQUE (user_id, position_id)
);

CREATE INDEX idx_esp_user ON emp_salary_position (user_id);

-- ============================================================================
-- 10. emp_salary_experience
-- ============================================================================
CREATE TABLE emp_salary_experience (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID          NOT NULL,
    experience_id   UUID          NOT NULL,
    assigned_at     TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ese_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_ese_experience FOREIGN KEY (experience_id) REFERENCES salary_experience (id) ON DELETE RESTRICT,
    CONSTRAINT uq_ese_user_experience UNIQUE (user_id, experience_id)
);

CREATE INDEX idx_ese_user ON emp_salary_experience (user_id);

-- ============================================================================
-- 11. emp_salary_bonus
-- ============================================================================
CREATE TABLE emp_salary_bonus (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID          NOT NULL,
    bonus_id        UUID          NOT NULL,
    assigned_at     TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_esb_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_esb_bonus FOREIGN KEY (bonus_id) REFERENCES salary_bonus (id) ON DELETE RESTRICT,
    CONSTRAINT uq_esb_user_bonus UNIQUE (user_id, bonus_id)
);

CREATE INDEX idx_esb_user ON emp_salary_bonus (user_id);

-- ============================================================================
-- 12. config_gps
-- ============================================================================
CREATE TABLE config_gps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    latitude        DECIMAL(10, 8) NOT NULL,
    longitude       DECIMAL(11, 8) NOT NULL,
    radius          DECIMAL(10, 2) NOT NULL DEFAULT 100,
    address         VARCHAR(255),
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT ck_config_gps_radius CHECK (radius > 0)
);

CREATE INDEX idx_config_gps_is_active ON config_gps (is_active);

-- ============================================================================
-- 13. config_qr
-- ============================================================================
CREATE TABLE config_qr (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expiry_minutes  INTEGER       NOT NULL DEFAULT 5,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT ck_config_qr_expiry CHECK (expiry_minutes > 0)
);

CREATE INDEX idx_config_qr_is_active ON config_qr (is_active);

-- ============================================================================
-- 14. config_attendance
-- ============================================================================
CREATE TABLE config_attendance (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    late_threshold_minutes  INTEGER       NOT NULL DEFAULT 15,
    is_active               BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT ck_config_attendance_threshold CHECK (late_threshold_minutes >= 0)
);

CREATE INDEX idx_config_attendance_is_active ON config_attendance (is_active);

-- ============================================================================
-- 15. audit_log
-- ============================================================================
CREATE TABLE audit_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID,
    action          VARCHAR(100)  NOT NULL,
    entity_type     VARCHAR(50)   NOT NULL,
    entity_id       UUID,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      INET,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_audit_log_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_log_user ON audit_log (user_id);
CREATE INDEX idx_audit_log_action ON audit_log (action);
CREATE INDEX idx_audit_log_entity ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log (created_at);
