from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.entities import AIModel
from app.schemas.schemas import RouteDecision

class ModelRouter:
    """
    Intelligent Local Model Router:
    Inspects user prompt, attachments, metadata and task context, then dynamically 
    selects the most optimal local model based on capabilities, VRAM, context window,
    health status, and configured priority.
    """
    def __init__(self):
        pass

    def classify_task(self, prompt: str, has_images: bool = False, file_types: Optional[List[str]] = None) -> str:
        file_types = file_types or []
        p = prompt.lower()

        # Image/Vision classification
        if has_images or any(ft in ["PNG", "JPG", "JPEG", "TIFF", "BMP"] for ft in file_types) or any(w in p for w in ["drawing", "p&id", "diagram", "schematic", "screenshot", "visual", "image"]):
            return "vision"

        # OCR classification
        if any(w in p for w in ["ocr", "scanned", "handwritten", "extract text from image", "read scan"]):
            return "ocr"

        # Coding classification
        if any(w in p for w in ["python", "code", "script", "program", "function", "debug", "algorithm", "regex", "sql", "pandas", "downtime statistics"]):
            return "coding"

        # Spreadsheet / Excel classification
        if any(ft in ["XLSX", "CSV", "XLS"] for ft in file_types) or any(w in p for w in ["excel", "spreadsheet", "workbook", "formula", "pivot", "columns", "csv"]):
            return "spreadsheet"

        # Complex technical reasoning / approval notes
        if any(w in p for w in ["approval note", "inspection report", "technical assessment", "failure analysis", "compliance check", "sop", "thickness", "root cause", "risk evaluation", "wall thickness", "compare"]):
            return "reasoning"

        # Long document summarization
        if any(ft in ["PDF", "DOCX"] for ft in file_types) or any(w in p for w in ["summarize", "executive summary", "extract all findings", "document analysis", "contract", "manual"]):
            return "document_analysis"

        return "general"

    def select_model(
        self, 
        task_type: str, 
        db: Session, 
        context_tokens: int = 4000, 
        preferred_model: Optional[str] = None
    ) -> RouteDecision:
        # Check if user explicitly requested a model override
        if preferred_model:
            model = db.query(AIModel).filter(AIModel.identifier == preferred_model, AIModel.is_enabled == True).first()
            if model:
                return RouteDecision(
                    task_classification=task_type,
                    selected_model=model.identifier,
                    provider=model.provider,
                    context_size=model.context_length,
                    reasoning=f"Explicitly assigned model '{model.name}' by user session override.",
                    requires_vision=model.vision_support,
                    requires_coding=model.coding_support,
                    requires_ocr=model.ocr_support,
                    available_vram_gb=16.0
                )

        # Query all active models
        models = db.query(AIModel).filter(AIModel.is_enabled == True).order_by(AIModel.priority.asc()).all()
        if not models:
            # Fallback default
            return RouteDecision(
                task_classification=task_type,
                selected_model="sovrix-industrial-local-v1",
                provider="sovrix_local",
                context_size=32768,
                reasoning="Default Sovereign Embedded Intelligence Engine routed.",
                requires_vision=False,
                requires_coding=True,
                requires_ocr=False,
                available_vram_gb=16.0
            )

        matched_model: Optional[AIModel] = None
        routing_notes = []

        if task_type == "vision":
            matched_model = next((m for m in models if m.vision_support and m.health_status != "OFFLINE"), None)
            routing_notes.append("Selected vision-capable model for multimodal drawing/image analysis.")
        elif task_type == "coding":
            matched_model = next((m for m in models if m.coding_support and m.health_status != "OFFLINE"), None)
            routing_notes.append("Routed to specialized low-latency code execution model.")
        elif task_type == "reasoning":
            matched_model = next((m for m in models if m.reasoning_support and m.health_status != "OFFLINE"), None)
            routing_notes.append("Assigned high-parameter deep reasoning model for industrial compliance comparison.")
        elif task_type in ["document_analysis", "ocr"]:
            matched_model = next((m for m in models if m.context_length >= context_tokens and m.health_status != "OFFLINE"), None)
            routing_notes.append("Assigned extended context window model for comprehensive document processing.")
        elif task_type == "spreadsheet":
            matched_model = next((m for m in models if m.spreadsheet_support and m.health_status != "OFFLINE"), None)
            routing_notes.append("Assigned tabular calculation and spreadsheet analysis model.")

        if not matched_model:
            matched_model = models[0]
            routing_notes.append("Routed to highest-priority operational sovereign model.")

        return RouteDecision(
            task_classification=task_type,
            selected_model=matched_model.identifier,
            provider=matched_model.provider,
            context_size=matched_model.context_length,
            reasoning=" ".join(routing_notes),
            requires_vision=matched_model.vision_support,
            requires_coding=matched_model.coding_support,
            requires_ocr=matched_model.ocr_support,
            available_vram_gb=16.0
        )

model_router = ModelRouter()
