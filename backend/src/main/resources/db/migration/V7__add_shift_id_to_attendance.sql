ALTER TABLE attendance ADD COLUMN shift_id UUID REFERENCES shifts(id);
