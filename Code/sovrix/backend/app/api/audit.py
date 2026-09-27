from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import AuditLog
from app.schemas.schemas import AuditLogOut

router = APIRouter(prefix="/audit", tags=["Enterprise Audit Logging"])

@router.get("", response_model=List[AuditLogOut])
def get_audit_logs(
    user: Optional[str] = None,
    action: Optional[str] = None,
    model: Optional[str] = None,
    tool: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if user:
        query = query.filter(AuditLog.user_name.ilike(f"%{user}%"))
    if action:
        query = query.filter(AuditLog.action_type.ilike(f"%{action}%"))
    if model:
        query = query.filter(AuditLog.model_used.ilike(f"%{model}%"))
    if tool:
        query = query.filter(AuditLog.tool_used.ilike(f"%{tool}%"))
    if status:
        query = query.filter(AuditLog.result_status == status)

    logs = query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [
        AuditLogOut(
            id=log.id,
            user_name=log.user_name,
            action_type=log.action_type,
            task_name=log.task_name,
            model_used=log.model_used,
            tool_used=log.tool_used,
            document_referenced=log.document_referenced,
            result_status=log.result_status,
            execution_duration_ms=log.execution_duration_ms,
            network_state=log.network_state,
            details_json=log.details_json or {},
            timestamp=log.timestamp
        )
        for log in logs
    ]
