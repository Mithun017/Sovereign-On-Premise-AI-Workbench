# SOVRIX API Reference Specification (v1.0.0)

Base URL: `/api/v1`

## 1. Authentication
- `POST /auth/login` - Authenticate user credentials and issue JWT bearer token.
- `GET /auth/me` - Retrieve current user profile and RBAC role.

## 2. Model Registry & Router
- `GET /models` - List registered local models with capability metadata and priority.
- `POST /models` - Register new local inference adapter (Ollama, vLLM, llama.cpp).
- `POST /models/{id}/health` - Execute ping/health check against local inference endpoint.
- `PATCH /models/{id}/toggle` - Enable or disable a model in the router.

## 3. Autonomous Agent Runtime
- `POST /chat` - Execute interactive agent task with conversational context.
- `POST /agents/run` - Execute standalone multi-step task and return step breakdown.
- `GET /agents/runs` - List recent agent execution runs.
- `GET /agents/{id}` - Retrieve details and duration of a specific run.
- `GET /agents/{id}/steps` - Retrieve step-by-step telemetry, inputs, and outputs.
- `WS /ws/agent/{agent_id}` - Stream live agent step execution over WebSockets.

## 4. Document Pipeline & Local OCR
- `GET /documents` - List all uploaded confidential documents.
- `POST /documents/upload` - Upload file (PDF, DOCX, XLSX, PNG, JPG) with department tag.
- `POST /documents/{id}/ocr` - Execute local neural OCR and index text into knowledge base.

## 5. Knowledge Base & Citations
- `GET /knowledge/collections` - List enterprise knowledge collections.
- `POST /knowledge/collections` - Create new confidential collection.
- `POST /knowledge/search` - Execute hybrid vector + keyword retrieval with citations.

## 6. Sandboxed Code Lab
- `POST /code/execute` - Run Python script in isolated sandbox with test assertions.

## 7. Deterministic Calculation Engine
- `POST /calculate` - Evaluate mathematical formulas with verified step breakdown.

## 8. Document Factory & Deliverables
- `GET /deliverables` - List all generated deliverables.
- `POST /deliverables/word` - Generate structured Word (.DOCX) approval note.
- `POST /deliverables/excel` - Generate structured Excel (.XLSX) workbook with formulas.
- `POST /deliverables/powerpoint` - Generate PowerPoint (.PPTX) presentation.
- `GET /deliverables/download/{filename}` - Download generated deliverable file.

## 9. Sovereignty & System Monitoring
- `GET /system/status` - Live GPU/VRAM/CPU/RAM/NVMe hardware telemetry.
- `GET /system/network` - Air-gap compliance and external connection statistics.
- `GET /system/events` - Live network packet interception event log.
- `GET /audit` - Query immutable audit logs with multi-field filtering.

## 10. Industrial Demo Scenarios
- `POST /demo/run-scenario-1` - Trigger Scenario 1: Inspection Report → DOCX Approval Note.
- `POST /demo/run-scenario-2` - Trigger Scenario 2: Downtime CSV → Python Sandbox → XLSX.
- `POST /demo/run-scenario-3` - Trigger Scenario 3: P&ID Drawing → Vision Model → PPTX.
