-- Create table for salary position experiences
CREATE TABLE salary_position_experiences (
    id UUID PRIMARY KEY,
    position_id UUID NOT NULL,
    min_years REAL,
    max_years REAL,
    salary_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (position_id) REFERENCES salary_positions(id) ON DELETE CASCADE
);

-- Alter users table to add new fields and modify existing
ALTER TABLE users 
    ADD COLUMN position_id UUID,
    ADD COLUMN initial_experience_years REAL DEFAULT 0,
    ADD COLUMN join_date TIMESTAMP WITH TIME ZONE;

-- We need to add foreign key constraint if position_id refers to salary_positions
ALTER TABLE users
    ADD CONSTRAINT fk_user_position FOREIGN KEY (position_id) REFERENCES salary_positions(id) ON DELETE SET NULL;

-- Remove old 'position' column if needed, but let's keep it if any old data uses it, or drop it.
-- Let's drop the 'position' column since it's replaced by position_id
ALTER TABLE users DROP COLUMN IF EXISTS position;
