from typing import List, Optional
from datetime import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import KnowledgeCollection, DocumentChunk
from app.schemas.schemas import (
    KnowledgeCollectionOut, KnowledgeCollectionCreate,
    KnowledgeSearchRequest, KnowledgeSearchResult
)
from app.services.knowledge.knowledge_engine import knowledge_engine

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base & Citations"])

@router.get("/collections", response_model=List[KnowledgeCollectionOut])
def list_collections(db: Session = Depends(get_db)):
    colls = db.query(KnowledgeCollection).all()
    results = []
    for c in colls:
        count = db.query(DocumentChunk).filter(DocumentChunk.collection_id == c.id).count()
        results.append(KnowledgeCollectionOut(
            id=c.id,
            name=c.name,
            description=c.description,
            department=c.department,
            access_level=c.access_level,
            created_at=c.created_at,
            chunk_count=count
        ))
    return results

@router.post("/collections", response_model=KnowledgeCollectionOut)
def create_collection(payload: KnowledgeCollectionCreate, db: Session = Depends(get_db)):
    coll = KnowledgeCollection(
        id=str(uuid.uuid4()),
        name=payload.name,
        description=payload.description,
        department=payload.department,
        access_level=payload.access_level,
        created_at=datetime.utcnow()
    )
    db.add(coll)
    db.commit()
    db.refresh(coll)
    return KnowledgeCollectionOut(
        id=coll.id,
        name=coll.name,
        description=coll.description,
        department=coll.department,
        access_level=coll.access_level,
        created_at=coll.created_at,
        chunk_count=0
    )

@router.post("/search", response_model=List[KnowledgeSearchResult])
def search_knowledge_base(payload: KnowledgeSearchRequest, db: Session = Depends(get_db)):
    results = knowledge_engine.hybrid_search(
        db=db,
        query=payload.query,
        collection_id=payload.collection_id,
        department=payload.department,
        top_k=payload.top_k
    )
    return results
