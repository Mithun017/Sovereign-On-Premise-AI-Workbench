# SOVRIX — Sovereign On-Premise Agentic AI Workbench

> **"Private intelligence. Local execution. Zero external dependency."**

SOVRIX is an enterprise-grade, air-gapped, local-first agentic AI platform designed for confidential industrial environments such as refineries, PSUs, defense-linked manufacturing organizations, and government institutions.

The application ensures that all confidential documents, code, images, engineering drawings, and operational knowledge remain strictly inside the organization's physical or on-premise infrastructure with **zero cloud AI calls or external network telemetry**.

---

## 🚀 Key Features

* **Intelligent Local Model Router**: Dynamically classifies incoming tasks (`reasoning`, `coding`, `vision`, `ocr`, `spreadsheet`, `document_analysis`) and routes queries to the optimal local model adapter.
* **Pluggable Local Inference Adapters**: First-class support for **Ollama**, **vLLM**, **llama.cpp**, and an embedded **Sovereign Intelligence Engine**.
* **Autonomous Multi-Step Agent Runtime**: Plans and executes multi-step workflows, dynamically invokes 15 tools, retrieves SOPs from local vector stores, and verifies outputs.
* **Local Neural OCR & Multimodal Vision**: On-premise optical character recognition for scanned reports and drawing inspection for P&ID schematics.
* **Deterministic Calculation Engine**: Exact mathematical computations with verified intermediate steps and unit validation (zero hallucination).
* **Sandboxed Code Execution (Network: DENIED)**: Isolated Python execution environment with strict memory/CPU bounds, timeout protections, and automated test assertions.
* **Real Document Factory**: Synthesizes genuine downloadable Microsoft Word (`.docx`), Excel (`.xlsx`), PowerPoint (`.pptx`), and PDF (`.pdf`) deliverables.
* **Sovereignty Monitor & Immutable Audit Trail**: Real-time network boundary packet interception displaying 0 external calls, air-gap proof, and tamper-resistant audit logs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, Lucide React, Recharts, Monaco Editor |
| **Backend** | Python 3.10+, FastAPI, Pydantic, SQLAlchemy, PostgreSQL / pgvector / SQLite, WebSockets, psutil |
| **Document Engine** | `python-docx`, `openpyxl`, `python-pptx`, `reportlab` |
| **Infrastructure** | Docker, Docker Compose (Air-Gapped Internal Bridge), Pytest |

---

## 📋 Verified Industrial Demonstration Scenarios

SOVRIX includes 3 pre-configured, synthetic industrial workflows demonstrating end-to-end local agent execution:

### 1. Inspection Report → Real Word (.DOCX) Approval Note
* **Input**: Scanned pipe inspection report (`IR-2026-8924`).
* **Workflow**: Local neural OCR $\rightarrow$ pgvector SOP retrieval (`SOP-INS-2025`) $\rightarrow$ Deterministic MAWT deficit calculation (1.08 mm deficit) $\rightarrow$ Risk assessment synthesis.
* **Deliverable**: Professional signed Word Approval Note (`.docx`).

### 2. Downtime Analytics → Python Sandbox & Excel (.XLSX)
* **Input**: Refinery equipment downtime CSV.
* **Workflow**: Schema inspection $\rightarrow$ Python pandas code synthesis $\rightarrow$ Isolated sandbox execution (`Network: DENIED`) $\rightarrow$ Automated test assertions.
* **Deliverable**: Production Excel workbook (`.xlsx`) with formulas.

### 3. Engineering P&ID Drawing → Vision & Slides (.PPTX)
* **Input**: Refinery P&ID schematic (`ENG-PID-4029-REV3`).
* **Workflow**: Local vision model inference (`Qwen2-VL`) $\rightarrow$ Equipment tag extraction (`P-101A/B`, `E-104`, `V-102`) $\rightarrow$ Flow logic breakdown.
* **Deliverable**: Executive PowerPoint presentation (`.pptx`).

---

## 📦 Directory Structure

```
SOVRIX/
├── Code/
│   └── sovrix/
│       ├── backend/              # FastAPI Application & Agent Runtime
│       │   ├── app/
│       │   │   ├── api/          # REST & WebSocket Endpoints
│       │   │   ├── core/         # Configuration & Security
│       │   │   ├── db/           # SQLAlchemy Engine
│       │   │   ├── models/       # Database Entities
│       │   │   ├── schemas/      # Pydantic Schemas
│       │   │   └── services/     # Router, Agent, Tools, Sandbox, Generator
│       │   └── requirements.txt
│       ├── frontend/             # React 18 + Vite + Tailwind Console
│       │   ├── src/
│       │   │   ├── components/   # Timeline, Visualizers, Cards, Sidebar
│       │   │   ├── pages/        # Workbench, CodeLab, Documents, etc.
│       │   │   └── services/     # API Client
│       │   └── package.json
│       ├── docker/               # Dockerfile & Docker Compose Config
│       ├── docs/                 # Architecture, Security, Air-Gap Specs
│       ├── scripts/              # Startup & Test Batch Scripts
│       └── tests/                # Pytest Test Suite
├── .gitignore
└── Readme.md
```

---

## ⚡ Quickstart Guide

### Option 1: Local Development

#### 1. Backend Setup:
```bash
cd "Code/sovrix/backend"
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API Swagger Documentation: `http://localhost:8000/docs`*

#### 2. Frontend Setup:
```bash
cd "Code/sovrix/frontend"
npm install
npm run dev
```
*Web Application Console: `http://localhost:5173`*

---

### Option 2: Docker Compose (Air-Gapped Mode)

```bash
cd "Code/sovrix/docker"
docker compose up --build
```

---

### Option 3: Running Test Suite

```bash
cd "Code/sovrix"
pytest -v
```

---

## 🔒 Air-Gap & Security Guarantee

SOVRIX is engineered to prevent data exfiltration:
- All model inference requests are processed on local host GPUs (`127.0.0.1`).
- All temporary code executions run with blocked proxy parameters.
- Sovereignty Monitor continuously enforces and verifies zero outbound egress.
