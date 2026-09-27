# SOVRIX Security & Governance Architecture

## 1. Authentication & RBAC Governance
SOVRIX implements strict Role-Based Access Control (RBAC):
- **Admin**: Full model registry configuration, user management, and security policy edits.
- **Engineer**: AI Workbench usage, document uploads, local OCR execution, code sandbox runs, and deliverable creation.
- **Auditor**: Read-only access to immutable audit trails, system telemetry, and sovereignty compliance metrics.
- **Operator**: Standard task execution and deliverable downloads.

## 2. Sandboxed Code Execution Safeguards
To prevent arbitrary code execution vulnerabilities:
1. **Isolated Subprocess Scopes**: Every Python script executes inside a unique, temporary workspace.
2. **Resource Boundaries**: Strict CPU quotas, 512 MB memory caps, and 15-second execution timeouts.
3. **No Ingress/Egress**: Environmental proxies are pointed to `0.0.0.0:0`.
4. **Automated Teardown**: Temporary directories are wiped immediately upon completion.

## 3. Provenance & Immutable Audit Logs
Every user and agent action creates an immutable log entry in the PostgreSQL/SQLite audit table:
- Timestamp, User / Agent ID
- Task Name, Model Adapter, Tool Name
- Document Referenced, Execution Duration, Status
- Egress State: `AIR-GAPPED (0 External)`
