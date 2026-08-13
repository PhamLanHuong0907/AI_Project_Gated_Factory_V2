-- ============================================================================
-- V11__update_leave_requests.sql
-- Update leave_requests table to match Entity (Idempotent)
-- ============================================================================

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leave_requests' AND column_name='leave_type') THEN
        ALTER TABLE leave_requests ADD COLUMN leave_type VARCHAR(50) NOT NULL DEFAULT 'ANNUAL_LEAVE';
        ALTER TABLE leave_requests ADD COLUMN start_date DATE;
        ALTER TABLE leave_requests ADD COLUMN end_date DATE;

        -- Populate existing rows (if any) with the old leave_date value
        -- Using dynamic SQL to avoid errors if leave_date doesn't exist
        EXECUTE 'UPDATE leave_requests SET start_date = leave_date, end_date = leave_date WHERE leave_date IS NOT NULL';

        ALTER TABLE leave_requests ALTER COLUMN start_date SET NOT NULL;
        ALTER TABLE leave_requests ALTER COLUMN end_date SET NOT NULL;
        
        ALTER TABLE leave_requests DROP COLUMN leave_date;
    END IF;
END $$;
