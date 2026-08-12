-- Drop the old constraint
ALTER TABLE salary_penalties DROP CONSTRAINT ck_salary_penalties_type;

-- Recreate the constraint with 'OTHER'
ALTER TABLE salary_penalties ADD CONSTRAINT ck_salary_penalties_type CHECK (penalty_type IN ('LATE', 'ABSENT', 'EARLY_LEAVE', 'OTHER'));
