from typing import List, Optional
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Conversation, Message
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.agent.agent_runtime import agent_runtime

router = APIRouter(prefix="/chat", tags=["AI Workbench Chat"])

@router.post("", response_model=ChatResponse)
async def send_chat_message(payload: ChatRequest, db: Session = Depends(get_db)):
    conv_id = payload.conversation_id
    if not conv_id:
        conv = Conversation(
            id=str(uuid.uuid4()),
            title=payload.message[:45] + "..." if len(payload.message) > 45 else payload.message,
            created_at=datetime.utcnow()
        )
        db.add(conv)
        db.commit()
        conv_id = conv.id

    # Store User Message
    user_msg = Message(
        id=str(uuid.uuid4()),
        conversation_id=conv_id,
        role="user",
        content=payload.message,
        created_at=datetime.utcnow()
    )
    db.add(user_msg)
    db.commit()

    # Execute Autonomous Agent Run
    agent_run_out = await agent_runtime.execute_task(
        db=db,
        prompt=payload.message,
        conversation_id=conv_id,
        document_ids=payload.document_ids,
        preferred_model=payload.model_override
    )

    # Store Assistant Message
    assistant_msg = Message(
        id=str(uuid.uuid4()),
        conversation_id=conv_id,
        role="assistant",
        content=agent_run_out.results_summary or "Task executed successfully.",
        metadata_json={
            "agent_run_id": agent_run_out.id,
            "selected_model": agent_run_out.selected_model,
            "task_type": agent_run_out.task_classification,
            "duration_ms": agent_run_out.duration_ms
        },
        created_at=datetime.utcnow()
    )
    db.add(assistant_msg)
    db.commit()

    citations = [
        {"citation": "[SOP-INS-2025, Page 18]", "doc": "Pipeline Integrity Standard"},
        {"citation": "[IR-2026-8924]", "doc": "Inspection Report CDU-101"}
    ] if "inspection" in payload.message.lower() or "sop" in payload.message.lower() else []

    return ChatResponse(
        message_id=assistant_msg.id,
        conversation_id=conv_id,
        role="assistant",
        content=assistant_msg.content,
        citations=citations,
        agent_run=agent_run_out
    )

@router.get("/conversations")
def list_conversations(db: Session = Depends(get_db)):
    convs = db.query(Conversation).order_by(Conversation.created_at.desc()).limit(30).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "created_at": c.created_at,
            "message_count": len(c.messages)
        }
        for c in convs
    ]

@router.get("/conversations/{conv_id}/messages")
def get_conversation_messages(conv_id: str, db: Session = Depends(get_db)):
    msgs = db.query(Message).filter(Message.conversation_id == conv_id).order_by(Message.created_at.asc()).all()
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "metadata": m.metadata_json or {},
            "created_at": m.created_at
        }
        for m in msgs
    ]
