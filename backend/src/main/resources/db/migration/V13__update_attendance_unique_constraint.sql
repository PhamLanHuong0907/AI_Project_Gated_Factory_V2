ALTER TABLE attendance DROP CONSTRAINT IF EXISTS uq_attendance_user_date;
ALTER TABLE attendance ADD CONSTRAINT uq_attendance_user_shift_date UNIQUE (user_id, shift_id, date);
