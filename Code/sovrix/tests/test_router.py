import pytest
from app.services.router.model_router import model_router
from app.db.session import SessionLocal
from app.main import seed_initial_data

def test_task_classification():
    assert model_router.classify_task("Write a python script to calculate downtime") == "coding"
    assert model_router.classify_task("Identify tags in this P&ID drawing schematic") == "vision"
    assert model_router.classify_task("Perform OCR on scanned inspection report") == "ocr"
    assert model_router.classify_task("Compare inspection wall thickness against SOP-INS-2025") == "reasoning"
    assert model_router.classify_task("Summarize equipment downtime spreadsheet", file_types=["CSV"]) == "spreadsheet"

def test_model_selection():
    seed_initial_data()
    db = SessionLocal()
    try:
        decision = model_router.select_model("coding", db)
        assert decision.selected_model is not None
        assert decision.requires_coding is True
        
        vision_decision = model_router.select_model("vision", db)
        assert vision_decision.requires_vision is True
    finally:
        db.close()
