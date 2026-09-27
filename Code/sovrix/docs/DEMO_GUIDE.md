# SOVRIX End-to-End Industrial Demo Guide

This guide details the three mandatory production scenarios built and verified in SOVRIX.

---

## DEMO 1: Ultrasonic Inspection Report → Real Word (.DOCX) Approval Note (Dev.md Section 30)

### Objective:
Process a confidential scanned pipe inspection report, execute local neural OCR, retrieve the standard operating procedure (SOP) from the on-premise knowledge base, calculate wall thickness deficit deterministically, and generate a signed executive Word Approval Note.

### Workflow Execution Steps:
1. **Navigate** to `AI Workbench` in the left sidebar or click `1: Inspection Report → Word` in the top header.
2. The agent executes 6 sequential autonomous steps:
   - **Step 1: Task Classification & Model Routing**: Routes task to `sovrix-deepseek-r1-local` (Reasoning specialization).
   - **Step 2: Local Neural OCR**: Analyzes `IR-2026-8924_CDU101_Inspection.pdf` and extracts measured wall thickness: **3.42 mm** at elbow bend `EB-04B`.
   - **Step 3: Knowledge Base Search**: Queries pgvector store and retrieves `[SOP-INS-2025, Page 18, Section 4.2]` which dictates a Minimum Allowable Wall Thickness (MAWT) of **4.50 mm**.
   - **Step 4: Deterministic Math**: Computes `Deficit = 4.50 - 3.42 = 1.08 mm` (24.0% below statutory retirement limit).
   - **Step 5: Industrial Reasoning**: Synthesizes risk evaluation, process hazard analysis, and $35,500 emergency work order budget.
   - **Step 6: Deliverable Factory**: Compiles and outputs a real downloadable Word document: `Approval_Note_XXXXX.docx`.
3. Click **"Download Real File"** on the right deliverable panel to inspect the generated `.docx` document.

---

## DEMO 2: Equipment Downtime Telemetry → Python Sandbox & Excel (.XLSX) (Dev.md Section 31)

### Objective:
Ingest equipment telemetry CSV, synthesize Python pandas code, execute inside an isolated sandbox with `Network: DENIED`, run automated test assertions, and generate a multi-column Excel analytics workbook with formulas.

### Workflow Execution Steps:
1. Click `2: Downtime Code → Excel` in the header or prompt the workbench: `"Calculate equipment downtime statistics from CSV and generate Excel"`.
2. The agent executes:
   - **Step 1: CSV Schema Inspection**: Reads column definitions (`incident_id`, `equipment_tag`, `unit`, `downtime_minutes`, `severity`, `failure_cause`).
   - **Step 2: Code Synthesis**: Synthesizes a vectorized pandas script computing plant availability (97.43%) and total downtime (18.50 hours).
   - **Step 3: Sandboxed Execution**: Runs script in temporary directory with `Network: DENIED (Air-Gapped: 0 Outbound Egress)`.
   - **Step 4: Automated Test Assertions**: Evaluates 3 unit tests with 100% pass rate.
   - **Step 5: Deliverable Generation**: Synthesizes `Equipment_Analytics_XXXXX.xlsx` with embedded SUM formulas and styling.
3. Download the `.xlsx` deliverable and inspect calculations in Microsoft Excel.

---

## DEMO 3: Refinery P&ID Engineering Drawing → Local Vision & Slides (.PPTX) (Dev.md Section 32)

### Objective:
Upload a refinery P&ID drawing, invoke the local vision model (`Qwen2-VL`), extract equipment tags and flow logic, and generate a 16:9 executive PowerPoint presentation.

### Workflow Execution Steps:
1. Click `3: P&ID Drawing → Slides` in the header.
2. The agent executes:
   - **Step 1: Vision Model Invocation**: Local vision model processes drawing `ENG-PID-4029-REV3`.
   - **Step 2: Component & Tag Extraction**: Detects crude feed pumps `P-101A/B`, shell exchanger `E-104`, accumulator `V-102`, and pressure control valve `PCV-042`.
   - **Step 3: Deliverable Generation**: Synthesizes a real multi-slide presentation: `Executive_Briefing_XXXXX.pptx`.
3. Download and present the generated `.pptx` slide deck.
