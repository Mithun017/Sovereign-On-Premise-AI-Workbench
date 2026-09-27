import pytest
from pathlib import Path
from app.services.generator.deliverable_factory import deliverable_factory
from app.schemas.schemas import GenerateWordRequest, GenerateExcelRequest, GeneratePowerPointRequest

def test_generate_word():
    req = GenerateWordRequest(
        title="Test Approval Note",
        subject="Emergency Pipeline Overhaul",
        background="Inspection discovered wall thinning.",
        references=["[SOP-INS-2025, Page 18]"],
        findings=["Measured thickness: 3.42 mm", "MAWT: 4.50 mm"],
        technical_assessment="Segment replacement required.",
        financial_impact="$35,500",
        recommendation="Execute emergency replacement",
        approval_requested="Chief Engineer"
    )
    res = deliverable_factory.generate_word_approval_note(req)
    assert res.file_type == "DOCX"
    assert res.filename.endswith(".docx")
    assert Path(deliverable_factory.output_dir / res.filename).exists()

def test_generate_excel():
    req = GenerateExcelRequest(
        title="Downtime Test Matrix",
        sheet_name="Downtime",
        columns=["Equipment", "Downtime (Hrs)", "Severity"],
        rows=[
            ["P-101A", 4.0, "CRITICAL"],
            ["E-104", 2.0, "MEDIUM"]
        ]
    )
    res = deliverable_factory.generate_excel_sheet(req)
    assert res.file_type == "XLSX"
    assert res.filename.endswith(".xlsx")
    assert Path(deliverable_factory.output_dir / res.filename).exists()

def test_generate_powerpoint():
    req = GeneratePowerPointRequest(
        title="Engineering Presentation",
        subtitle="Asset Integrity Overview",
        slides=[
            {"title": "Slide 1", "bullets": ["First point", "Second point"]}
        ]
    )
    res = deliverable_factory.generate_powerpoint(req)
    assert res.file_type == "PPTX"
    assert res.filename.endswith(".pptx")
    assert Path(deliverable_factory.output_dir / res.filename).exists()
