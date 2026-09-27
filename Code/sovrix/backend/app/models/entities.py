import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="Engineer") # Admin, Engineer, Auditor, Operator
    department = Column(String(100), default="Refinery Operations")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    title = Column(String(255), default="Industrial AI Session")
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    model_override = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(64), ForeignKey("conversations.id"), nullable=False)
    role = Column(String(20), nullable=False) # user, assistant, system
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    conversation = relationship("Conversation", back_populates="messages")

class AIModel(Base):
    __tablename__ = "models"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    identifier = Column(String(100), nullable=False, unique=True)
    provider = Column(String(50), default="ollama") # ollama, vllm, llamacpp, sovrix_local
    endpoint = Column(String(255), default="http://127.0.0.1:11434")
    context_length = Column(Integer, default=32768)
    vram_requirement_gb = Column(Float, default=8.0)
    vision_support = Column(Boolean, default=False)
    coding_support = Column(Boolean, default=True)
    reasoning_support = Column(Boolean, default=True)
    ocr_support = Column(Boolean, default=False)
    spreadsheet_support = Column(Boolean, default=True)
    priority = Column(Integer, default=1)
    is_enabled = Column(Boolean, default=True)
    health_status = Column(String(50), default="ONLINE") # ONLINE, OFFLINE, DEGRADED
    last_health_check = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentRun(Base):
    __tablename__ = "agent_runs"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(64), ForeignKey("conversations.id"), nullable=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    task_prompt = Column(Text, nullable=False)
    task_classification = Column(String(50), default="general") # coding, reasoning, vision, ocr, document_analysis, spreadsheet
    selected_model = Column(String(100), nullable=True)
    status = Column(String(30), default="RUNNING") # PENDING, RUNNING, SUCCESS, FAILED, BLOCKED
    plan_json = Column(JSON, default=list)
    results_summary = Column(Text, nullable=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration_ms = Column(Integer, default=0)
    external_calls_prevented = Column(Integer, default=0)
    
    conversation = relationship("Conversation", back_populates="agent_runs")
    steps = relationship("AgentStep", back_populates="agent_run", cascade="all, delete-orphan")

class AgentStep(Base):
    __tablename__ = "agent_steps"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    agent_run_id = Column(String(64), ForeignKey("agent_runs.id"), nullable=False)
    step_number = Column(Integer, nullable=False)
    step_title = Column(String(255), nullable=False)
    step_type = Column(String(50), default="TOOL") # CLASSIFY, PLAN, TOOL, OCR, VISION, KB_SEARCH, CODE_EXEC, REASON, VERIFY, DELIVERABLE
    tool_name = Column(String(100), nullable=True)
    status = Column(String(30), default="RUNNING") # PENDING, RUNNING, SUCCESS, FAILED, BLOCKED
    input_payload = Column(JSON, default=dict)
    output_payload = Column(JSON, default=dict)
    duration_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    agent_run = relationship("AgentRun", back_populates="steps")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False) # PDF, DOCX, XLSX, PPTX, TXT, CSV, PNG, JPG
    file_size_bytes = Column(Integer, default=0)
    storage_path = Column(String(500), nullable=False)
    page_count = Column(Integer, default=1)
    is_scanned = Column(Boolean, default=False)
    ocr_processed = Column(Boolean, default=False)
    extracted_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    department = Column(String(100), default="General Operations")
    uploaded_by = Column(String(100), default="System Operator")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    pages = relationship("DocumentPage", back_populates="document", cascade="all, delete-orphan")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentPage(Base):
    __tablename__ = "document_pages"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    document_id = Column(String(64), ForeignKey("documents.id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    text_content = Column(Text, nullable=True)
    ocr_confidence = Column(Float, default=0.98)
    visual_observations = Column(Text, nullable=True)
    has_image = Column(Boolean, default=False)
    
    document = relationship("Document", back_populates="pages")

class KnowledgeCollection(Base):
    __tablename__ = "knowledge_collections"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    department = Column(String(100), default="Refinery")
    access_level = Column(String(50), default="CONFIDENTIAL")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    chunks = relationship("DocumentChunk", back_populates="collection")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    document_id = Column(String(64), ForeignKey("documents.id"), nullable=True)
    collection_id = Column(String(64), ForeignKey("knowledge_collections.id"), nullable=True)
    chunk_index = Column(Integer, default=0)
    content = Column(Text, nullable=False)
    citation_reference = Column(String(255), nullable=False) # e.g. [SOP-INS-2025, Page 18]
    metadata_json = Column(JSON, default=dict)
    embedding_vector = Column(JSON, default=list) # Stored as JSON array for local/pgvector
    created_at = Column(DateTime, default=datetime.utcnow)
    
    document = relationship("Document", back_populates="chunks")
    collection = relationship("KnowledgeCollection", back_populates="chunks")

class Deliverable(Base):
    __tablename__ = "deliverables"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False) # DOCX, XLSX, PPTX, PDF
    filename = Column(String(255), nullable=False)
    storage_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    agent_run_id = Column(String(64), ForeignKey("agent_runs.id"), nullable=True)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class SandboxExecution(Base):
    __tablename__ = "sandbox_executions"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    code_content = Column(Text, nullable=False)
    language = Column(String(30), default="python")
    stdout = Column(Text, default="")
    stderr = Column(Text, default="")
    exit_code = Column(Integer, default=0)
    execution_time_ms = Column(Integer, default=0)
    network_status = Column(String(30), default="DENIED")
    resource_usage = Column(JSON, default=dict) # cpu_percent, memory_mb
    test_results = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_name = Column(String(100), default="SYSTEM_AGENT")
    action_type = Column(String(100), nullable=False) # AGENT_EXECUTE, FILE_ACCESS, MODEL_INFERENCE, TOOL_RUN, SANDBOX_RUN, DOC_GENERATE
    task_name = Column(String(255), nullable=True)
    model_used = Column(String(100), nullable=True)
    tool_used = Column(String(100), nullable=True)
    document_referenced = Column(String(255), nullable=True)
    result_status = Column(String(30), default="SUCCESS") # SUCCESS, FAILED, BLOCKED
    execution_duration_ms = Column(Integer, default=0)
    network_state = Column(String(50), default="AIR-GAPPED (0 External)")
    details_json = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow)

class SystemEvent(Base):
    __tablename__ = "system_events"
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_type = Column(String(50), nullable=False) # NETWORK_BLOCKED, HARDWARE_ALERT, MODEL_ONLINE, AIRGAP_ENFORCED
    source = Column(String(100), default="SOVRIX_CORE")
    destination = Column(String(100), default="LOCAL_ISOLATION")
    action = Column(String(100), default="TRAFFIC_CONTAINED")
    status = Column(String(50), default="BLOCKED")
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
