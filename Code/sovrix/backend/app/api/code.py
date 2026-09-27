from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import CodeExecutionRequest, CodeExecutionResponse
from app.services.sandbox.sandbox_runner import sandbox_runner
from app.models.entities import SandboxExecution
from app.services.sovereignty.monitor import sovereignty_monitor

router = APIRouter(prefix="/code", tags=["Sandboxed Code Lab"])

@router.post("/execute", response_model=CodeExecutionResponse)
async def execute_code_in_sandbox(payload: CodeExecutionRequest, db: Session = Depends(get_db)):
    res = await sandbox_runner.execute(
        code=payload.code,
        tests=payload.tests,
        timeout_seconds=payload.timeout_seconds,
        stdin=payload.stdin
    )

    # Persist execution run for audit
    db_exec = SandboxExecution(
        id=res.id,
        code_content=payload.code,
        language=payload.language,
        stdout=res.stdout,
        stderr=res.stderr,
        exit_code=res.exit_code,
        execution_time_ms=res.execution_time_ms,
        network_status="DENIED",
        resource_usage=res.resource_usage,
        test_results=res.test_results,
        created_at=res.created_at
    )
    db.add(db_exec)
    db.commit()

    return res
