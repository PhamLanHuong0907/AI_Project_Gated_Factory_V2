# Database Rules

Flyway owns schema evolution. Do not modify an applied migration. Physical design must define tables, columns, constraints, indexes, seed data, data classification, and traceability to requirement IDs. Hibernate must use `ddl-auto=validate`.
