from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import AgentRunOut
from app.services.agent.agent_runtime import agent_runtime

router = APIRouter(prefix="/demo", tags=["Industrial End-to-End Scenarios"])

@router.post("/run-scenario-1", response_model=AgentRunOut)
async def run_scenario_1_inspection_approval_note(db: Session = Depends(get_db)):
    """
    Scenario 1 (Dev.md Section 30):
    Upload scanned inspection report -> OCR locally -> Retrieve SOP from knowledge base -> 
    Calculate wall thickness deficit -> Reason over evidence -> Generate Word (.DOCX) approval note.
    """
    prompt = "Analyze the ultrasonic inspection report for Crude Distillation Line PL-4820-A, compare against SOP-INS-2025 wall thickness limits, calculate the deficit deterministically, and generate a formal executive Approval Note in Word (.DOCX)."
    return await agent_runtime.execute_task(db=db, prompt=prompt)

@router.post("/run-scenario-2", response_model=AgentRunOut)
async def run_scenario_2_equipment_downtime_coding(db: Session = Depends(get_db)):
    """
    Scenario 2 (Dev.md Section 31):
    Inspect equipment downtime CSV -> Generate Python data pipeline -> 
    Execute inside air-gapped sandbox (Network: DENIED) -> Run automated tests -> Generate Excel (.XLSX).
    """
    prompt = "Create a Python program that calculates equipment downtime statistics and unit availability from equipment_downtime.csv, run tests in the air-gapped sandbox, and generate an analytical Excel workbook."
    return await agent_runtime.execute_task(db=db, prompt=prompt)

@router.post("/run-scenario-3", response_model=AgentRunOut)
async def run_scenario_3_pid_multimodal_vision(db: Session = Depends(get_db)):
    """
    Scenario 3 (Dev.md Section 32):
    Upload refinery P&ID drawing -> Local vision model analysis -> 
    Extract equipment tags (P-101A, E-104, etc.) -> Local reasoning -> Generate Presentation (.PPTX).
    """
    prompt = "Identify visible equipment tags from refinery P&ID drawing ENG-PID-4029-REV3, summarize major components using local vision model, and generate an executive PowerPoint presentation."
    return await agent_runtime.execute_task(db=db, prompt=prompt)
