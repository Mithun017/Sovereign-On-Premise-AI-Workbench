from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Auth schemas
class UserLogin(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None
    role: str = "Engineer"
    department: str = "Refinery Operations"

class UserOut(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str]
    role: str
    department: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Model Registry Schemas
class AIModelCreate(BaseModel):
    name: str
    identifier: str
    provider: str = "ollama" # ollama, vllm, llamacpp, sovrix_local
    endpoint: str = "http://127.0.0.1:11434"
    context_length: int = 32768
    vram_requirement_gb: float = 8.0
    vision_support: bool = False
    coding_support: bool = True
    reasoning_support: bool = True
    ocr_support: bool = False
    spreadsheet_support: bool = True
    priority: int = 1
    is_enabled: bool = True

class AIModelOut(AIModelCreate):
    id: str
    health_status: str
    last_health_check: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

class ModelHealthCheckResponse(BaseModel):
    model_id: str
    identifier: str
    provider: str
    status: str
    latency_ms: int
    is_airgapped: bool = True
    details: str

# Router Schemas
class RouteDecision(BaseModel):
    task_classification: str
    selected_model: str
    provider: str
    context_size: int
    reasoning: str
    requires_vision: bool = False
    requires_coding: bool = False
    requires_ocr: bool = False
    available_vram_gb: float = 16.0

# Document & OCR Schemas
class DocumentOut(BaseModel):
    id: str
    filename: str
    original_name: str
    file_type: str
    file_size_bytes: int
    page_count: int
    is_scanned: bool
    ocr_processed: bool
    extracted_text: Optional[str] = None
    summary: Optional[str] = None
    department: str
    uploaded_by: str
    created_at: datetime
    class Config:
        from_attributes = True

class DocumentPageOut(BaseModel):
    id: str
    document_id: str
    page_number: int
    text_content: Optional[str]
    ocr_confidence: float
    visual_observations: Optional[str]
    has_image: bool
    class Config:
        from_attributes = True

class OCRRequest(BaseModel):
    language: str = "eng"
    enhance_contrast: bool = True

class OCRResponse(BaseModel):
    document_id: str
    pages_processed: int
    extracted_text: str
    confidence_score: float
    visual_features_found: List[str] = []
    duration_ms: int

# Knowledge Base Schemas
class KnowledgeCollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    department: str = "Refinery Operations"
    access_level: str = "CONFIDENTIAL"

class KnowledgeCollectionOut(KnowledgeCollectionCreate):
    id: str
    created_at: datetime
    chunk_count: int = 0
    class Config:
        from_attributes = True

class KnowledgeSearchRequest(BaseModel):
    query: str
    collection_id: Optional[str] = None
    department: Optional[str] = None
    top_k: int = 5
    min_score: float = 0.5

class KnowledgeSearchResult(BaseModel):
    chunk_id: str
    document_id: Optional[str]
    document_name: str
    citation: str # e.g. [SOP-INS-2025, Page 18]
    content: str
    score: float
    metadata: Dict[str, Any] = {}

# Code Execution Sandbox Schemas
class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    timeout_seconds: Optional[int] = 10
    stdin: Optional[str] = None
    tests: Optional[List[str]] = None # Optional test assertions to evaluate

class CodeExecutionResponse(BaseModel):
    id: str
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: int
    network_status: str = "DENIED (Air-Gapped)"
    security_status: str = "SANDBOXED_SECURE"
    resource_usage: Dict[str, Any] = {"cpu_percent": 12.4, "memory_mb": 42.8}
    test_results: Dict[str, Any] = {}
    created_at: datetime

# Deterministic Calculation Engine Schemas
class CalculationRequest(BaseModel):
    expression: str
    variables: Dict[str, float] = {}
    unit: Optional[str] = None
    task_context: Optional[str] = None

class CalculationStep(BaseModel):
    step_number: int
    description: str
    intermediate_value: float
    formula_used: str

class CalculationResponse(BaseModel):
    inputs: Dict[str, Any]
    formula: str
    steps: List[CalculationStep]
    final_result: float
    units: Optional[str]
    is_verified: bool
    explanation: str

# Deliverable Generation Schemas
class GenerateWordRequest(BaseModel):
    title: str
    subject: str
    background: str
    references: List[str]
    findings: List[str]
    technical_assessment: str
    financial_impact: Optional[str] = None
    risk_matrix: Optional[str] = None
    recommendation: str
    approval_requested: str
    attachments: Optional[List[str]] = None

class GenerateExcelRequest(BaseModel):
    title: str
    sheet_name: str = "Downtime_Analysis"
    columns: List[str]
    rows: List[List[Any]]
    summary_metrics: Optional[Dict[str, Any]] = None

class GeneratePowerPointRequest(BaseModel):
    title: str
    subtitle: str
    slides: List[Dict[str, Any]] # [{"title": "...", "bullets": ["..."]}]

class DeliverableOut(BaseModel):
    id: str
    title: str
    file_type: str
    filename: str
    download_url: str
    file_size_bytes: int
    created_at: datetime
    class Config:
        from_attributes = True

# Agent Schemas
class AgentStepOut(BaseModel):
    id: str
    step_number: int
    step_title: str
    step_type: str
    tool_name: Optional[str]
    status: str # PENDING, RUNNING, SUCCESS, FAILED, BLOCKED
    input_payload: Dict[str, Any] = {}
    output_payload: Dict[str, Any] = {}
    duration_ms: int
    created_at: datetime
    class Config:
        from_attributes = True

class AgentRunCreate(BaseModel):
    task_prompt: str
    conversation_id: Optional[str] = None
    document_ids: Optional[List[str]] = []
    preferred_model: Optional[str] = None

class AgentRunOut(BaseModel):
    id: str
    conversation_id: Optional[str]
    task_prompt: str
    task_classification: str
    selected_model: str
    status: str
    plan_json: List[Dict[str, Any]] = []
    results_summary: Optional[str]
    start_time: datetime
    end_time: Optional[datetime]
    duration_ms: int
    external_calls_prevented: int
    steps: List[AgentStepOut] = []
    class Config:
        from_attributes = True

# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    document_ids: Optional[List[str]] = []
    model_override: Optional[str] = None

class ChatResponse(BaseModel):
    message_id: str
    conversation_id: str
    role: str
    content: str
    citations: List[Dict[str, Any]] = []
    agent_run: Optional[AgentRunOut] = None

# Sovereignty & System Schemas
class SovereigntyStats(BaseModel):
    air_gapped: bool = True
    external_connections: int = 0
    internet_requests: int = 0
    external_dns_requests: int = 0
    cloud_ai_requests: int = 0
    telemetry_requests: int = 0
    blocked_requests: int = 248
    local_model_requests: int = 142
    network_interface: str = "loopback-only / vlan-isolated-409"
    firewall_status: str = "ENFORCED_ZERO_EGRESS"

class SystemTelemetry(BaseModel):
    gpu_name: str = "NVIDIA RTX A6000 Sovereign Array"
    gpu_utilization_percent: float = 38.5
    vram_used_gb: float = 14.2
    vram_total_gb: float = 48.0
    cpu_utilization_percent: float = 24.1
    ram_used_gb: float = 18.6
    ram_total_gb: float = 64.0
    disk_used_gb: float = 120.4
    disk_total_gb: float = 2000.0
    active_agents: int = 1
    total_documents: int = 12
    knowledge_chunks: int = 428
    configured_models: int = 5
    sovereignty: SovereigntyStats

class AuditLogOut(BaseModel):
    id: str
    user_name: str
    action_type: str
    task_name: Optional[str]
    model_used: Optional[str]
    tool_used: Optional[str]
    document_referenced: Optional[str]
    result_status: str
    execution_duration_ms: int
    network_state: str
    details_json: Dict[str, Any] = {}
    timestamp: datetime
    class Config:
        from_attributes = True
