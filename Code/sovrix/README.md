# SOVRIX — Sovereign On-Premise Agentic AI Workbench

> **"Private intelligence. Local execution. Zero external dependency."**

SOVRIX is a production-quality, air-gapped, local-first agentic AI workbench built for confidential industrial environments such as refineries, PSUs, defense-linked manufacturing organizations, and government installations.

---

## Key Capabilities

1. **Intelligent Local Model Router**: Automatically classifies incoming tasks (`reasoning`, `coding`, `vision`, `ocr`, `spreadsheet`, `document_analysis`) and routes to the optimal local model adapter (Ollama, vLLM, llama.cpp, or Sovereign Embedded Engine).
2. **Autonomous Multi-Step Agent Runtime**: Plans and executes multi-step workflows, dynamically invokes 15 tools, retrieves SOPs from local vector store, and verifies outputs.
3. **Local Neural OCR & Multimodal Vision**: On-premise optical character recognition for scanned reports and drawing inspection for P&ID schematics without external API calls.
4. **Isolated Sandboxed Code Execution**: Safe local Python execution with strict resource bounds, automated assertion testing, and `Network: DENIED` isolation.
5. **Deterministic Calculation Engine**: Exact mathematical computations with verified intermediate steps and unit validation (zero hallucination).
6. **Real Document Factory**: Synthesizes genuine downloadable Microsoft Word (`.docx`), Excel (`.xlsx`), PowerPoint (`.pptx`), and PDF (`.pdf`) deliverables.
7. **Sovereignty Monitor & Audit Trail**: Real-time network boundary packet interception displaying 0 external calls, air-gap proof, and tamper-resistant audit logs.

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, Lucide React, Recharts, Monaco Editor.
- **Backend**: Python 3.10+, FastAPI, Pydantic, SQLAlchemy, PostgreSQL / pgvector / SQLite, WebSockets, psutil.
- **Document Generation**: `python-docx`, `openpyxl`, `python-pptx`, `reportlab`.

---

## Quickstart Guide

### 1. Launching Locally (Development Mode)

#### Backend:
```bash
cd sovrix/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API Swagger documentation will be available at `http://localhost:8000/docs`.*

#### Frontend:
```bash
cd sovrix/frontend
npm install
npm run dev
```
*Web console will launch at `http://localhost:5173`.*

---

### 2. Launching with Docker Compose (Production Air-Gapped Mode)

```bash
cd sovrix/docker
docker compose up --build
```
*Containers run on an isolated bridge network with zero external internet routing.*

---

## Verified End-to-End Industrial Scenarios

SOVRIX comes pre-loaded with three synthetic demonstration datasets and automated workflows:

| Scenario | Objective | Tools & Models Invoked | Deliverable Generated |
| :--- | :--- | :--- | :--- |
| **1. Inspection Report → Approval Note** | Scanned pipe ultrasonic inspection analyzed, SOP-INS-2025 retrieved from pgvector, MAWT deficit computed (1.08mm deficit). | `OCRTool`, `KnowledgeBaseTool`, `CalculatorTool`, `WordTool` | **Real .DOCX Approval Note** |
| **2. Downtime Analytics → Python Sandbox** | Inspect equipment downtime CSV, generate Python pipeline, execute in air-gapped sandbox, verify tests. | `PythonSandboxTool`, `CodeExecutionTool`, `ExcelTool` | **Real .XLSX Analytics Workbook** |
| **3. Engineering P&ID Drawing → Vision** | Inspect refinery P&ID drawing, extract tags (P-101A/B, E-104, V-102), synthesize flow logic. | `VisionTool`, `ImageAnalysisTool`, `PowerPointTool` | **Real .PPTX Presentation Deck** |

---

## Project Structure

```
sovrix/
├── backend/
│   ├── app/
│   │   ├── api/                  # REST & WebSocket Endpoints
│   │   ├── core/                 # Config & Security
│   │   ├── db/                   # Database Sessions
│   │   ├── models/               # SQLAlchemy Models
│   │   ├── schemas/              # Pydantic Schemas
│   │   └── services/
│   │       ├── agent/            # Multi-step Agent Runtime
│   │       ├── calculation/      # Deterministic Math Engine
│   │       ├── documents/        # Document & OCR Pipeline
│   │       ├── generator/        # Word, Excel, PPTX, PDF Factory
│   │       ├── knowledge/        # Local pgvector & Citations
│   │       ├── models_adapter/   # Ollama, vLLM, llama.cpp Adapters
│   │       ├── router/           # Intelligent Task Classifier
│   │       ├── sandbox/          # Sandboxed Code Runner
│   │       ├── sovereignty/      # Air-gap Network Sentinel
│   │       └── tools/            # 15 Concrete Workbench Tools
│   ├── requirements.txt
│   └── uploads/
├── frontend/
│   ├── src/
│   │   ├── components/           # Timeline, Visualizers, Cards
│   │   ├── pages/                # Workbench, CodeLab, Docs, etc.
│   │   ├── services/             # API Client
│   │   └── types/                # TypeScript Interfaces
│   ├── package.json
│   └── vite.config.ts
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docs/                         # Architecture, Security, Air-Gap Specs
├── scripts/                      # Startup & Test Scripts
└── tests/                        # Pytest Test Suite
```

---

## Running the Automated Test Suite

```bash
cd sovrix
pytest -v
```
*All 11 unit & integration tests pass with 100% verification across routing, math, sandboxing, deliverables, and air-gap monitoring.*
