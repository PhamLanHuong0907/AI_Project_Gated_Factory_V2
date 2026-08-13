ALTER TABLE attendance DROP CONSTRAINT IF EXISTS uq_attendance_user_date;
DROP INDEX IF EXISTS uq_attendance_user_date;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_attendance_user_shift_date') THEN
        ALTER TABLE attendance ADD CONSTRAINT uq_attendance_user_shift_date UNIQUE (user_id, shift_id, date);
    END IF;
END $$;
