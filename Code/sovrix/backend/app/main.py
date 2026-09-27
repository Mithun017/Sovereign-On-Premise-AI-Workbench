import json
import uuid
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import engine, Base, SessionLocal, get_db
from app.models.entities import (
    User, AIModel, KnowledgeCollection, Document, DocumentChunk, AuditLog
)
from app.core.security import get_password_hash
from app.api.api_router import api_router
from app.services.knowledge.knowledge_engine import knowledge_engine

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SOVRIX - Sovereign On-Premise Agentic AI Workbench",
    version=settings.VERSION,
    description="Air-Gapped Local Intelligence Runtime for Defense, Refineries, PSUs and Confidential Industrial Infrastructure.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router)

# WebSocket Connection Manager for Live Agent Execution Streaming
class AgentWebSocketManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, agent_id: str):
        await websocket.accept()
        if agent_id not in self.active_connections:
            self.active_connections[agent_id] = []
        self.active_connections[agent_id].append(websocket)

    def disconnect(self, websocket: WebSocket, agent_id: str):
        if agent_id in self.active_connections:
            self.active_connections[agent_id].remove(websocket)
            if not self.active_connections[agent_id]:
                del self.active_connections[agent_id]

    async def broadcast_step(self, agent_id: str, message: dict):
        if agent_id in self.active_connections:
            for connection in self.active_connections[agent_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    pass

ws_manager = AgentWebSocketManager()

@app.websocket("/ws/agent/{agent_id}")
async def websocket_agent_endpoint(websocket: WebSocket, agent_id: str):
    await ws_manager.connect(websocket, agent_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or handle incoming client ping
            await websocket.send_text(json.dumps({"status": "CONNECTED", "agent_id": agent_id}))
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, agent_id)

@app.get("/")
def root_status():
    return {
        "workbench": "SOVRIX Sovereign AI",
        "version": settings.VERSION,
        "security_mode": "AIR-GAPPED (Zero External AI APIs)",
        "status": "OPERATIONAL",
        "timestamp": datetime.utcnow().isoformat()
    }

# Seed Default Industrial Demo Data on Startup
def seed_initial_data():
    db = SessionLocal()
    try:
        # 1. Default Admin / Reliability Engineer User
        if not db.query(User).filter(User.username == "sovrix_admin").first():
            admin_user = User(
                username="sovrix_admin",
                email="chief.engineer@refinery.internal",
                hashed_password=get_password_hash("sovrix2026"),
                full_name="Chief Asset Integrity Engineer",
                role="Admin",
                department="Asset Integrity & Reliability",
                is_active=True
            )
            db.add(admin_user)

        # 2. Local AI Models in Registry
        models_data = [
            {
                "name": "Sovereign Industrial DeepSeek-R1 (Local)",
                "identifier": "sovrix-deepseek-r1-local",
                "provider": "sovrix_local",
                "endpoint": "http://127.0.0.1:11434",
                "context_length": 65536,
                "vram_requirement_gb": 16.0,
                "vision_support": False,
                "coding_support": True,
                "reasoning_support": True,
                "ocr_support": True,
                "spreadsheet_support": True,
                "priority": 1,
                "is_enabled": True,
                "health_status": "ONLINE"
            },
            {
                "name": "Qwen2.5-Coder-32B Air-Gapped",
                "identifier": "qwen2.5-coder-32b-local",
                "provider": "ollama",
                "endpoint": "http://127.0.0.1:11434",
                "context_length": 32768,
                "vram_requirement_gb": 18.5,
                "vision_support": False,
                "coding_support": True,
                "reasoning_support": True,
                "ocr_support": False,
                "spreadsheet_support": True,
                "priority": 2,
                "is_enabled": True,
                "health_status": "ONLINE"
            },
            {
                "name": "Qwen2-VL Multimodal Vision Array",
                "identifier": "qwen2-vl-vision-local",
                "provider": "vllm",
                "endpoint": "http://127.0.0.1:8000/v1",
                "context_length": 32768,
                "vram_requirement_gb": 22.0,
                "vision_support": True,
                "coding_support": False,
                "reasoning_support": True,
                "ocr_support": True,
                "spreadsheet_support": False,
                "priority": 3,
                "is_enabled": True,
                "health_status": "ONLINE"
            },
            {
                "name": "Mistral-Nemo-128K Document Specialist",
                "identifier": "mistral-nemo-128k-local",
                "provider": "llamacpp",
                "endpoint": "http://127.0.0.1:8080",
                "context_length": 131072,
                "vram_requirement_gb": 12.0,
                "vision_support": False,
                "coding_support": False,
                "reasoning_support": True,
                "ocr_support": True,
                "spreadsheet_support": False,
                "priority": 4,
                "is_enabled": True,
                "health_status": "ONLINE"
            }
        ]

        for m_info in models_data:
            if not db.query(AIModel).filter(AIModel.identifier == m_info["identifier"]).first():
                m = AIModel(**m_info)
                db.add(m)

        # 3. Knowledge Collections
        colls = [
            {"name": "Refinery Operating Procedures (SOPs)", "description": "Mandatory statutory maintenance and inspection SOPs", "department": "Operations"},
            {"name": "Inspection & NDT Standards", "description": "API-570, ASME B31.3 and internal ultrasonic thickness limits", "department": "Asset Integrity"},
            {"name": "Equipment Engineering Manuals", "description": "Centrifugal pumps, shell & tube heat exchangers, and separator vessels", "department": "Mechanical"}
        ]
        created_colls = {}
        for c_info in colls:
            c = db.query(KnowledgeCollection).filter(KnowledgeCollection.name == c_info["name"]).first()
            if not c:
                c = KnowledgeCollection(
                    id=str(uuid.uuid4()),
                    name=c_info["name"],
                    description=c_info["description"],
                    department=c_info["department"],
                    access_level="CONFIDENTIAL"
                )
                db.add(c)
                db.commit()
                db.refresh(c)
            created_colls[c_info["name"]] = c.id

        # 4. Ingest Synthetic Standard Document (SOP-INS-2025)
        sop_doc = db.query(Document).filter(Document.original_name == "SOP-INS-2025_Pipeline_Integrity.pdf").first()
        if not sop_doc:
            sop_text = (
                "STANDARD OPERATING PROCEDURE: HYDROCARBON PIPELINE INTEGRITY & ULTRASONIC SURVEYS (SOP-INS-2025)\n\n"
                "SECTION 1: APPLICABILITY & SCOPE\n"
                "This SOP governs all in-service crude distillation transfer lines, overhead vapour headers, and heavy fraction piping operating at gauge pressures exceeding 15.0 Bar within Refinery Processing Zone 04.\n\n"
                "SECTION 2: ULTRASONIC THICKNESS MEASUREMENT PROTOCOL\n"
                "Ultrasonic thickness survey readings must be logged every 90 days across all 90-degree and 45-degree elbow bends susceptible to turbulent erosion-corrosion. Minimum grid density is 8 points around circumference.\n\n"
                "SECTION 3: MINIMUM ALLOWABLE WALL THICKNESS (MAWT) CRITERIA\n"
                "For Schedule 40 and Schedule 80 ASTM A106-B Carbon Steel lines operating at design pressures up to 30 Bar, the absolute statutory Minimum Allowable Wall Thickness (MAWT) is 4.50 mm. Any measured point below 4.50 mm represents an immediate non-compliance condition requiring urgent isolation.\n\n"
                "SECTION 4: EMERGENCY MITIGATION & APPROVAL DIRECTIVE\n"
                "Upon detection of localized thinning below 4.50 mm, the Reliability Engineer must draft an Emergency Technical Approval Note for the Chief General Manager, execute bypass diversion, and commission Schedule 80 segment replacement within 48 hours."
            )
            sop_doc = Document(
                id=str(uuid.uuid4()),
                filename="SOP-INS-2025_Pipeline_Integrity.pdf",
                original_name="SOP-INS-2025_Pipeline_Integrity.pdf",
                file_type="PDF",
                file_size_bytes=len(sop_text.encode('utf-8')),
                storage_path=str(settings.UPLOAD_DIR / "SOP-INS-2025_Pipeline_Integrity.pdf"),
                page_count=4,
                is_scanned=False,
                ocr_processed=True,
                extracted_text=sop_text,
                department="Asset Integrity",
                uploaded_by="System Administrator",
                created_at=datetime.utcnow()
            )
            db.add(sop_doc)
            db.commit()
            db.refresh(sop_doc)

            # Index chunks into knowledge base
            knowledge_engine.chunk_and_index_document(
                db=db,
                doc_id=sop_doc.id,
                doc_name=sop_doc.original_name,
                full_text=sop_text,
                department="Asset Integrity",
                collection_id=created_colls.get("Inspection & NDT Standards")
            )

        # 5. Ingest Synthetic Scanned Inspection Report (IR-2026-8924)
        ir_doc = db.query(Document).filter(Document.original_name == "IR-2026-8924_CDU101_Inspection.pdf").first()
        if not ir_doc:
            ir_text = (
                "ASSET INTEGRITY ULTRASONIC INSPECTION REPORT #IR-2026-8924\n"
                "UNIT: CDU-101 (CRUDE DISTILLATION UNIT) | LINE: PL-4820-A (14-INCH ASTM A106-B)\n"
                "LOCATION: ELBOW BEND JUNCTION EB-04B | OPERATING PRESSURE: 28.5 BAR\n"
                "NOMINAL THICKNESS: 9.52 mm | MEASURED MINIMUM THICKNESS: 3.42 mm\n"
                "STATUTORY RETIREMENT LIMIT (SOP-INS-2025): 4.50 mm\n"
                "DEFICIT: 1.08 mm (24.0% BELOW SAFE RETIREMENT LIMIT)\n"
                "ACTION MANDATE: IMMEDIATE WORK ORDER FOR SEGMENT REPLACEMENT"
            )
            ir_doc = Document(
                id=str(uuid.uuid4()),
                filename="IR-2026-8924_CDU101_Inspection.pdf",
                original_name="IR-2026-8924_CDU101_Inspection.pdf",
                file_type="PDF",
                file_size_bytes=len(ir_text.encode('utf-8')),
                storage_path=str(settings.UPLOAD_DIR / "IR-2026-8924_CDU101_Inspection.pdf"),
                page_count=3,
                is_scanned=True,
                ocr_processed=True,
                extracted_text=ir_text,
                department="Refinery Operations",
                uploaded_by="Reliability Inspector",
                created_at=datetime.utcnow()
            )
            db.add(ir_doc)
            db.commit()

        # 6. Audit Log Initial Events
        if db.query(AuditLog).count() == 0:
            init_audit = AuditLog(
                id=str(uuid.uuid4()),
                user_name="SOVRIX_SENTINEL",
                action_type="SYSTEM_INITIALIZE_AIRGAP",
                task_name="Verify Zero External Egress Firewall & Enforce Air-Gap Boundary",
                model_used="SOVRIX_CORE",
                tool_used="FirewallSentinel",
                result_status="SUCCESS",
                execution_duration_ms=45,
                network_state="AIR-GAPPED (0 External)",
                details_json={"status": "AIR-GAPPED ACTIVE", "external_api_calls": 0},
                timestamp=datetime.utcnow()
            )
            db.add(init_audit)

        db.commit()
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    seed_initial_data()
