-- ============================================================================
-- V11__update_leave_requests.sql
-- Update leave_requests table to match Entity
-- ============================================================================

ALTER TABLE leave_requests
    ADD COLUMN leave_type VARCHAR(50) NOT NULL DEFAULT 'ANNUAL_LEAVE',
    ADD COLUMN start_date DATE,
    ADD COLUMN end_date DATE;

-- Populate existing rows (if any) with the old leave_date value
UPDATE leave_requests SET start_date = leave_date, end_date = leave_date WHERE leave_date IS NOT NULL;

-- Now make start_date and end_date NOT NULL
ALTER TABLE leave_requests
    ALTER COLUMN start_date SET NOT NULL,
    ALTER COLUMN end_date SET NOT NULL;

-- Drop the old leave_date column
ALTER TABLE leave_requests
    DROP COLUMN leave_date;
