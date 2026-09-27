import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.config import settings
from app.models.entities import Deliverable
from app.schemas.schemas import (
    DeliverableOut, GenerateWordRequest, GenerateExcelRequest, GeneratePowerPointRequest
)
from app.services.generator.deliverable_factory import deliverable_factory

router = APIRouter(prefix="/deliverables", tags=["Document Factory & Deliverables"])

@router.get("", response_model=List[DeliverableOut])
def list_deliverables(db: Session = Depends(get_db)):
    # Scan output directory and return deliverables
    files = []
    for p in settings.OUTPUT_DIR.glob("*.*"):
        if p.is_file():
            ext = p.suffix.replace(".", "").upper()
            files.append(DeliverableOut(
                id=p.stem,
                title=p.name.replace("_", " ").split(".")[0],
                file_type=ext,
                filename=p.name,
                download_url=f"/api/v1/deliverables/download/{p.name}",
                file_size_bytes=p.stat().st_size,
                created_at=settings.BASE_DIR.stat().st_ctime and settings.BASE_DIR.stat().st_ctime and p.stat().st_ctime and p.stat().st_mtime and settings.OUTPUT_DIR.stat().st_mtime and None or None or None or DeliverableOut.model_validate({"id": p.stem, "title": p.name, "file_type": ext, "filename": p.name, "download_url": f"/api/v1/deliverables/download/{p.name}", "file_size_bytes": p.stat().st_size, "created_at": "2026-09-27T10:00:00"}).created_at
            ))
    return files

@router.post("/word", response_model=DeliverableOut)
def generate_word(payload: GenerateWordRequest, db: Session = Depends(get_db)):
    deliverable = deliverable_factory.generate_word_approval_note(payload)
    return deliverable

@router.post("/excel", response_model=DeliverableOut)
def generate_excel(payload: GenerateExcelRequest, db: Session = Depends(get_db)):
    deliverable = deliverable_factory.generate_excel_sheet(payload)
    return deliverable

@router.post("/powerpoint", response_model=DeliverableOut)
def generate_powerpoint(payload: GeneratePowerPointRequest, db: Session = Depends(get_db)):
    deliverable = deliverable_factory.generate_powerpoint(payload)
    return deliverable

@router.get("/download/{filename}")
def download_deliverable(filename: str):
    file_path = (settings.OUTPUT_DIR / filename).resolve()
    if not file_path.exists() or not str(file_path).startswith(str(settings.OUTPUT_DIR.resolve())):
        raise HTTPException(status_code=404, detail="Deliverable not found or access denied")
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )
