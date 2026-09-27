from fastapi import APIRouter
from app.api import (
    auth, models, chat, agents, documents, knowledge,
    code, deliverables, calculate, system, audit, demo
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(models.router)
api_router.include_router(chat.router)
api_router.include_router(agents.router)
api_router.include_router(documents.router)
api_router.include_router(knowledge.router)
api_router.include_router(code.router)
api_router.include_router(deliverables.router)
api_router.include_router(calculate.router)
api_router.include_router(system.router)
api_router.include_router(audit.router)
api_router.include_router(demo.router)
