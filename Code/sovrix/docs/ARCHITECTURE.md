# SOVRIX System Architecture Specification

## 1. Overview
**SOVRIX (Sovereign On-Premise Agentic AI Workbench)** is an air-gapped, local-first platform built specifically for defense-linked manufacturing, refineries, public sector undertakings (PSUs), and confidential government installations.

```
+-------------------------------------------------------------------------+
|                          SOVRIX WORKBENCH SHELL                         |
|   (React 18 + TypeScript + Vite + Tailwind CSS + Lucide + Monaco + Recharts) |
+-------------------------------------------------------------------------+
                                    | REST / WebSockets
                                    v
+-------------------------------------------------------------------------+
|                         FASTAPI CORE GATEWAY                            |
|  - RBAC Security & JWT Authenticator                                    |
|  - Real-time WebSockets Streamer                                        |
|  - Rate Limiter & Kernel Air-Gap Sentinel                               |
+-------------------------------------------------------------------------+
                                    |
     +------------------------------+------------------------------+
     |                              |                              |
     v                              v                              v
+-----------------------+ +-----------------------+ +-----------------------+
|  LOCAL MODEL ROUTER   | |  AGENTIC RUNTIME      | |  DETERMINISTIC MATH   |
|  - Task Classifier    | |  - Multi-step Planner | |  - Formula Evaluator  |
|  - VRAM/Capability    | |  - Memory & Execution | |  - Step Verification  |
|  - Model Adapters:    | |  - Verifier           | |  - Unit Checks        |
|    * Ollama / vLLM    | |  - 15 Dynamic Tools   | |  - Boundary Sentinel  |
|    * llama.cpp        | +-----------------------+ +-----------------------+
|    * Sovrix Local     |           |
+-----------------------+           v
     |                    +-----------------------+
     v                    |  ISOLATED SANDBOX     |
+-----------------------+ |  - Subprocess Scratch |
|  LOCAL KNOWLEDGE BASE | |  - CPU / Memory Limit |
|  - pgvector Chunks    | |  - Network: DENIED    |
|  - Hybrid BM25+Vector | |  - Automated Tests    |
|  - Citation Generator | +-----------------------+
+-----------------------+           |
                                    v
                          +-----------------------+
                          |  DOCUMENT FACTORY     |
                          |  - Real .DOCX Notes   |
                          |  - Real .XLSX Sheets  |
                          |  - Real .PPTX Decks   |
                          |  - Real .PDF Reports  |
                          +-----------------------+
```

## 2. Core Subsystems

### 2.1 Pluggable Model Adapter Layer
SOVRIX does not depend on external AI APIs (such as OpenAI, Anthropic, or Google Gemini cloud APIs). Local inference is mediated via `BaseModelAdapter` with out-of-the-box support for:
- **Ollama Adapter**: Local HTTP inference on `127.0.0.1:11434`.
- **vLLM Adapter**: High-throughput PagedAttention local inference on `127.0.0.1:8000`.
- **llama.cpp Adapter**: Quantized GGUF inference on `127.0.0.1:8080`.
- **Sovereign Embedded Engine**: Air-gapped fallback intelligence for guaranteed zero-downtime execution.

### 2.2 Intelligent Task Classification & Model Router
Classifies every incoming query into domain types (`reasoning`, `coding`, `vision`, `ocr`, `spreadsheet`, `document_analysis`, `general`) and dispatches the task to the model with matching capabilities, priority rank, context length, and available VRAM.

### 2.3 Sandboxed Execution Isolation
All generated Python code runs in temporary directories with restricted system environments, timeouts, and network proxies mapped to `0.0.0.0:0`, enforcing `Network: DENIED`.

### 2.4 Document Factory
Real binary files are synthesized using Python native document compilers:
- `python-docx` for structured Technical Approval Notes.
- `openpyxl` for multi-column worksheets with dynamic Excel formulas.
- `python-pptx` for executive briefing widescreen decks.
- `reportlab` for vector PDF engineering reports.
