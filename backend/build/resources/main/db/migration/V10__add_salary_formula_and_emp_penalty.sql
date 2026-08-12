-- Create config_salary table to store dynamic salary formula
CREATE TABLE config_salary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formula TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default formula
INSERT INTO config_salary (formula) VALUES ('{BASE_SALARY} + {TOTAL_BONUS} - {TOTAL_PENALTY}');

-- Create emp_salary_penalties table
CREATE TABLE emp_salary_penalties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    penalty_id UUID NOT NULL REFERENCES salary_penalties(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_emp_penalty UNIQUE (user_id, penalty_id)
);

CREATE INDEX idx_emp_salary_penalties_user ON emp_salary_penalties (user_id);
