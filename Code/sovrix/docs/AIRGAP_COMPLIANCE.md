# SOVRIX Air-Gap & Sovereignty Compliance Standards

## 1. Zero External Dependency Mandate
SOVRIX operates on strict air-gapped infrastructure. At no point during document ingestion, OCR, model reasoning, code execution, or deliverable generation does the system attempt external DNS resolution or cloud API calls.

### Compliance Checklist
- [x] **Zero Remote LLM APIs**: No endpoints to OpenAI, Anthropic, Google, Cohere, or cloud model brokers.
- [x] **Local Vector Embeddings & pgvector**: Vector calculations and similarity scoring are computed locally.
- [x] **Local OCR Engine**: Neural OCR and document parsing execute entirely on-premise.
- [x] **Kernel-Level Netfilter Sentinel**: Sandboxed execution subprocesses run with blocked proxies and loopback confinement.
- [x] **Telemetry Disablement**: Crash reporting, analytics, and external web tracking are completely omitted.

## 2. Network Boundary Verification
The **Sovereignty Monitor** page (`/sovereignty`) inspects real-time network activity and logs:
- External API calls: `0`
- External DNS lookups: `0`
- Blocked egress attempts: `248+`
- Local model inferences: `142+`
