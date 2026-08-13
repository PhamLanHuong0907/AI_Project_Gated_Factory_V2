-- ============================================================================
-- V14__drop_old_attendance_index.sql
-- Drop the old unique index that was missed by V13
-- ============================================================================

DROP INDEX IF EXISTS public.uq_attendance_user_date;
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS uq_attendance_user_date;
