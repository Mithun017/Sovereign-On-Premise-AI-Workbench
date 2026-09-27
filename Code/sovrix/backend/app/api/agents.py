from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import AgentRun, AgentStep
from app.schemas.schemas import AgentRunCreate, AgentRunOut, AgentStepOut
from app.services.agent.agent_runtime import agent_runtime

router = APIRouter(prefix="/agents", tags=["Agent Execution Runtime"])

@router.post("/run", response_model=AgentRunOut)
async def run_agent_task(payload: AgentRunCreate, db: Session = Depends(get_db)):
    result = await agent_runtime.execute_task(
        db=db,
        prompt=payload.task_prompt,
        conversation_id=payload.conversation_id,
        document_ids=payload.document_ids,
        preferred_model=payload.preferred_model
    )
    return result

@router.get("/runs", response_model=List[AgentRunOut])
def list_agent_runs(db: Session = Depends(get_db)):
    runs = db.query(AgentRun).order_by(AgentRun.start_time.desc()).limit(20).all()
    results = []
    for r in runs:
        steps_out = [
            AgentStepOut(
                id=s.id,
                step_number=s.step_number,
                step_title=s.step_title,
                step_type=s.step_type,
                tool_name=s.tool_name,
                status=s.status,
                input_payload=s.input_payload or {},
                output_payload=s.output_payload or {},
                duration_ms=s.duration_ms,
                created_at=s.created_at
            )
            for s in r.steps
        ]
        results.append(AgentRunOut(
            id=r.id,
            conversation_id=r.conversation_id,
            task_prompt=r.task_prompt,
            task_classification=r.task_classification,
            selected_model=r.selected_model or "sovrix-local",
            status=r.status,
            plan_json=[],
            results_summary=r.results_summary,
            start_time=r.start_time,
            end_time=r.end_time,
            duration_ms=r.duration_ms,
            external_calls_prevented=r.external_calls_prevented,
            steps=steps_out
        ))
    return results

@router.get("/{run_id}", response_model=AgentRunOut)
def get_agent_run(run_id: str, db: Session = Depends(get_db)):
    r = db.query(AgentRun).filter(AgentRun.id == run_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Agent run not found")
    
    steps_out = [
        AgentStepOut(
            id=s.id,
            step_number=s.step_number,
            step_title=s.step_title,
            step_type=s.step_type,
            tool_name=s.tool_name,
            status=s.status,
            input_payload=s.input_payload or {},
            output_payload=s.output_payload or {},
            duration_ms=s.duration_ms,
            created_at=s.created_at
        )
        for s in r.steps
    ]
    return AgentRunOut(
        id=r.id,
        conversation_id=r.conversation_id,
        task_prompt=r.task_prompt,
        task_classification=r.task_classification,
        selected_model=r.selected_model or "sovrix-local",
        status=r.status,
        plan_json=[],
        results_summary=r.results_summary,
        start_time=r.start_time,
        end_time=r.end_time,
        duration_ms=r.duration_ms,
        external_calls_prevented=r.external_calls_prevented,
        steps=steps_out
    )

@router.get("/{run_id}/steps", response_model=List[AgentStepOut])
def get_agent_steps(run_id: str, db: Session = Depends(get_db)):
    steps = db.query(AgentStep).filter(AgentStep.agent_run_id == run_id).order_by(AgentStep.step_number.asc()).all()
    return [
        AgentStepOut(
            id=s.id,
            step_number=s.step_number,
            step_title=s.step_title,
            step_type=s.step_type,
            tool_name=s.tool_name,
            status=s.status,
            input_payload=s.input_payload or {},
            output_payload=s.output_payload or {},
            duration_ms=s.duration_ms,
            created_at=s.created_at
        )
        for s in steps
    ]
