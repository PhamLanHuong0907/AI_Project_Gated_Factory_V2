-- ============================================================================
-- V3__fix_seed_passwords.sql
-- Fix password hashes to match documented passwords
-- ============================================================================
-- The V2 seed data used incorrect BCrypt hashes.
-- Correct passwords: admin123, hr123456, emp123456

UPDATE users SET password_hash = '$2b$10$Vm/pgNwTqY7bwb3uZdvMhe8l9TguqUQ/uMKQu6TCGKh1CRyfKav5S' WHERE email = 'admin@pas.vn';
UPDATE users SET password_hash = '$2b$10$Vm/pgNwTqY7bwb3uZdvMhev/WtR4MsF89cHaQncVwNUr4l35q2vc2' WHERE email = 'hr.manager@pas.vn';
UPDATE users SET password_hash = '$2b$10$Vm/pgNwTqY7bwb3uZdvMhew4phd2acemRT6v7JDyGQUdAbhEMWL2e' WHERE email = 'employee@pas.vn';
