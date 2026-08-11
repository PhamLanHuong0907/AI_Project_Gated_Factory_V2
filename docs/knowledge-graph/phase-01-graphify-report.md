# Phase 01 Graphify Report - Phần mềm Chấm công

## 1. Graphify Status

| Aspect | Status |
|--------|--------|
| Installation | Not installed |
| Command Available | No |
| Graph File | Not generated |

## 2. Graphify Commands

When Graphify is installed, the following commands are available:

```bash
# Query the knowledge graph
graphify query "How does authentication work?"

# Find relationships between concepts
graphify path "MOD-01" "MOD-07"

# Explain a concept
graphify explain "QR Attendance"

# Update the graph after code changes
graphify update .

# Generate graph report
graphify report
```

## 3. Repository Index (Manual)

Since Graphify is not installed, this manual index documents the repository structure:

### 3.1 Architecture Documents

| Document | Path | Purpose |
|----------|------|---------|
| System Context | docs/architecture/system-context.md | System overview and actors |
| Solution Architecture | docs/architecture/solution-architecture.md | High-level architecture |
| Security Architecture | docs/architecture/security-architecture.md | Security design |
| Deployment Architecture | docs/architecture/deployment-architecture.md | Docker deployment |

### 3.2 Database Documents

| Document | Path | Purpose |
|----------|------|---------|
| Logical Model | docs/database/logical-model.md | Entity relationships |
| Physical ERD | docs/database/physical-erd.md | Table specifications |
| Seed Data | docs/database/seed-data.md | Initial data |
| Migration Plan | docs/database/migration-plan.md | Flyway migrations |

### 3.3 API Documents

| Document | Path | Purpose |
|----------|------|---------|
| API Conventions | docs/api/api-conventions.md | REST conventions |
| OpenAPI Spec | docs/api/openapi.yaml | API specification |
| Error Catalog | docs/api/error-catalog.md | Error codes |
| Permission Matrix | docs/api/permission-matrix.md | RBAC matrix |

### 3.4 Requirement Documents

| Document | Path | Purpose |
|----------|------|---------|
| Overview | requirements/normalized/00-overview.md | Project overview |
| Module Map | requirements/normalized/01-module-map.md | Module inventory |
| Business Rules | requirements/normalized/03-business-rules.md | Business rules |
| Coverage Matrix | requirements/normalized/requirement-coverage-matrix.md | Coverage tracking |

## 4. Module Dependency Graph (Text)

```
MOD-07 (Auth) → MOD-08 (User Management)
                ↓
MOD-05 (QR Generation) → MOD-01 (QR Attendance)
                        ↓
MOD-06 (GPS Location) → MOD-01 (QR Attendance)
                        ↓
MOD-01 (QR Attendance) → MOD-03 (Reports)
                       → MOD-04 (Dashboard)
                       → MOD-02 (Mobile)
```

## 5. Cross-File Relationships

| Source | Target | Relationship |
|--------|--------|--------------|
| business-rules.md | openapi.yaml | BR-M01-06 → POST /attendance/scan |
| physical-erd.md | migration-plan.md | Tables → SQL migrations |
| permission-matrix.md | openapi.yaml | Roles → endpoint access |
| error-catalog.md | openapi.yaml | Error codes → responses |

## 6. Recommendations

1. **Install Graphify**: `npm install -g graphify` or equivalent
2. **Generate Graph**: Run `graphify update .` after installation
3. **Use for Navigation**: Run `graphify query "<question>"` for codebase questions
4. **Keep Updated**: Run `graphify update .` after code changes

## 7. Note

This report documents repository structure manually since Graphify is not installed. For full graph capabilities, install Graphify and regenerate this report.
