ALTER TABLE attendance DROP CONSTRAINT IF EXISTS ck_attendance_status;
ALTER TABLE attendance ADD CONSTRAINT ck_attendance_status CHECK (status IN ('ON_TIME', 'PRESENT', 'ABSENT', 'LATE', 'EARLY_LEAVE', 'ON_LEAVE', 'PENDING'));
