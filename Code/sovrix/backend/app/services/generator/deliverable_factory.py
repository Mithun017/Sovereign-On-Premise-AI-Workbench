import os
import uuid
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

import pptx
from pptx import Presentation
from pptx.util import Inches as PPTX_Inches, Pt as PPTX_Pt
from pptx.dml.color import RGBColor as PPTX_RGBColor

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from app.core.config import settings
from app.schemas.schemas import (
    GenerateWordRequest, GenerateExcelRequest, GeneratePowerPointRequest, DeliverableOut
)

class DeliverableFactory:
    """
    Production-grade Document Factory:
    Generates real, binary, downloadable Word (.docx), Excel (.xlsx), 
    PowerPoint (.pptx), and PDF (.pdf) documents formatted for industrial enterprise standards.
    """
    def __init__(self):
        self.output_dir = settings.OUTPUT_DIR
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate_word_approval_note(self, data: GenerateWordRequest) -> DeliverableOut:
        doc_id = str(uuid.uuid4())
        filename = f"Approval_Note_{doc_id[:8].upper()}.docx"
        file_path = self.output_dir / filename

        doc = docx.Document()
        
        # Header banner
        header_p = doc.add_paragraph()
        header_run = header_p.add_run("CONFIDENTIAL // FOR INTERNAL REFINERY RELIABILITY USE ONLY")
        header_run.font.size = Pt(8.5)
        header_run.font.bold = True
        header_run.font.color.rgb = RGBColor(120, 120, 120)
        header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT

        # Title
        title_p = doc.add_paragraph()
        title_run = title_p.add_run(data.title.upper())
        title_run.font.size = Pt(16)
        title_run.font.bold = True
        title_run.font.color.rgb = RGBColor(15, 23, 42) # Dark Slate

        # Meta Table
        table = doc.add_table(rows=4, cols=2)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False

        meta_rows = [
            ("SUBJECT:", data.subject),
            ("DATE & TIME:", datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")),
            ("SECURITY CLASSIFICATION:", "SOVEREIGN AIR-GAPPED ASSET INTEGRITY"),
            ("APPROVAL ROUTE:", data.approval_requested)
        ]
        for idx, (label, val) in enumerate(meta_rows):
            cell_lbl = table.cell(idx, 0)
            cell_val = table.cell(idx, 1)
            cell_lbl.text = label
            cell_lbl.paragraphs[0].runs[0].font.bold = True
            cell_lbl.paragraphs[0].runs[0].font.size = Pt(9.5)
            cell_val.text = val
            cell_val.paragraphs[0].runs[0].font.size = Pt(9.5)

        doc.add_paragraph() # spacing

        # Helper for styled sections
        def add_section(heading: str, body_text: str):
            h = doc.add_paragraph()
            hrun = h.add_run(heading)
            hrun.font.bold = True
            hrun.font.size = Pt(12)
            hrun.font.color.rgb = RGBColor(8, 145, 178) # Cyan-600
            
            p = doc.add_paragraph()
            prun = p.add_run(body_text)
            prun.font.size = Pt(10)
            p.paragraph_format.line_spacing = 1.15

        add_section("1. BACKGROUND & INCIDENT CONTEXT", data.background)

        # References
        if data.references:
            h = doc.add_paragraph()
            hrun = h.add_run("2. STATUTORY REFERENCES & APPLICABLE SOPS")
            hrun.font.bold = True
            hrun.font.size = Pt(12)
            hrun.font.color.rgb = RGBColor(8, 145, 178)
            for r in data.references:
                bp = doc.add_paragraph(style='List Bullet')
                brun = bp.add_run(r)
                brun.font.size = Pt(9.5)

        # Findings
        if data.findings:
            h = doc.add_paragraph()
            hrun = h.add_run("3. DETAILED INSPECTION FINDINGS & NDT MEASUREMENTS")
            hrun.font.bold = True
            hrun.font.size = Pt(12)
            hrun.font.color.rgb = RGBColor(8, 145, 178)
            for f in data.findings:
                bp = doc.add_paragraph(style='List Bullet')
                brun = bp.add_run(f)
                brun.font.size = Pt(9.5)

        add_section("4. TECHNICAL & STRUCTURAL ASSESSMENT", data.technical_assessment)

        if data.financial_impact:
            add_section("5. ESTIMATED FINANCIAL IMPACT & WORK ORDER BUDGET", data.financial_impact)

        if data.risk_matrix:
            add_section("6. RISK RATING & CONTAINMENT MATRIX", data.risk_matrix)

        add_section("7. ENGINEERING RECOMMENDATIONS", data.recommendation)
        add_section("8. APPROVAL & SIGN-OFF DIRECTIVE", f"Recommended for immediate sanction: {data.approval_requested}")

        # Signature blocks
        sig_table = doc.add_table(rows=2, cols=3)
        sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        headers = ["Prepared By: Reliability AI", "Verified By: Chief Inspector", "Approved By: CGM (Operations)"]
        for i, h in enumerate(headers):
            cell = sig_table.cell(0, i)
            cell.text = h
            cell.paragraphs[0].runs[0].font.bold = True
            cell.paragraphs[0].runs[0].font.size = Pt(9)
            
            sig_cell = sig_table.cell(1, i)
            sig_cell.text = "\n\n_______________________\nDate: _______________"
            sig_cell.paragraphs[0].runs[0].font.size = Pt(9)

        doc.save(file_path)
        file_size = file_path.stat().st_size

        return DeliverableOut(
            id=doc_id,
            title=data.title,
            file_type="DOCX",
            filename=filename,
            download_url=f"/api/v1/deliverables/download/{filename}",
            file_size_bytes=file_size,
            created_at=datetime.utcnow()
        )

    def generate_excel_sheet(self, data: GenerateExcelRequest) -> DeliverableOut:
        doc_id = str(uuid.uuid4())
        filename = f"Equipment_Analytics_{doc_id[:8].upper()}.xlsx"
        file_path = self.output_dir / filename

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = data.sheet_name[:30]

        # Theme styles
        header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
        header_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
        cell_font = Font(name="Segoe UI", size=10)
        border_thin = Border(
            left=Side(style='thin', color='CBD5E1'),
            right=Side(style='thin', color='CBD5E1'),
            top=Side(style='thin', color='CBD5E1'),
            bottom=Side(style='thin', color='CBD5E1')
        )

        # Title Row
        ws.merge_cells("A1:F1")
        title_cell = ws["A1"]
        title_cell.value = data.title.upper()
        title_cell.font = Font(name="Segoe UI", size=14, bold=True, color="0891B2")
        title_cell.alignment = Alignment(horizontal="left", vertical="center")
        ws.row_dimensions[1].height = 30

        # Subtitle
        ws["A2"] = f"Generated by SOVRIX Sovereign Workbench | {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"
        ws["A2"].font = Font(name="Segoe UI", size=9, italic=True, color="64748B")
        ws.row_dimensions[2].height = 18

        # Headers
        header_row_idx = 4
        ws.row_dimensions[header_row_idx].height = 24
        for col_idx, col_name in enumerate(data.columns, 1):
            cell = ws.cell(row=header_row_idx, column=col_idx, value=col_name)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = border_thin

        # Rows
        current_row = 5
        for row_data in data.rows:
            ws.row_dimensions[current_row].height = 20
            for col_idx, val in enumerate(row_data, 1):
                cell = ws.cell(row=current_row, column=col_idx, value=val)
                cell.font = cell_font
                cell.border = border_thin
                if isinstance(val, (int, float)):
                    cell.alignment = Alignment(horizontal="right", vertical="center")
                else:
                    cell.alignment = Alignment(horizontal="left", vertical="center")
            current_row += 1

        # Summary Row with Formulas
        summary_row = current_row + 1
        ws.cell(row=summary_row, column=1, value="TOTAL / SUMMARY").font = Font(name="Segoe UI", size=10, bold=True)
        # Add Excel SUM formulas where numerical
        for col_idx in range(2, len(data.columns) + 1):
            col_letter = get_column_letter(col_idx)
            sum_formula = f"=SUM({col_letter}5:{col_letter}{current_row-1})"
            cell = ws.cell(row=summary_row, column=col_idx, value=sum_formula)
            cell.font = Font(name="Segoe UI", size=10, bold=True, color="0891B2")
            cell.border = border_thin

        # Auto-fit column widths
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

        wb.save(file_path)
        file_size = file_path.stat().st_size

        return DeliverableOut(
            id=doc_id,
            title=data.title,
            file_type="XLSX",
            filename=filename,
            download_url=f"/api/v1/deliverables/download/{filename}",
            file_size_bytes=file_size,
            created_at=datetime.utcnow()
        )

    def generate_powerpoint(self, data: GeneratePowerPointRequest) -> DeliverableOut:
        doc_id = str(uuid.uuid4())
        filename = f"Executive_Briefing_{doc_id[:8].upper()}.pptx"
        file_path = self.output_dir / filename

        prs = Presentation()
        # 16:9 widescreen layout
        prs.slide_width = PPTX_Inches(13.333)
        prs.slide_height = PPTX_Inches(7.5)

        # Title slide
        blank_layout = prs.slide_layouts[6]
        slide = prs.slides.add_slide(blank_layout)

        # Background card
        tx_box = slide.shapes.add_textbox(PPTX_Inches(1.0), PPTX_Inches(1.8), PPTX_Inches(11.33), PPTX_Inches(3.5))
        tf = tx_box.text_frame
        tf.word_wrap = True

        p_title = tf.paragraphs[0]
        p_title.text = data.title.upper()
        p_title.font.bold = True
        p_title.font.size = PPTX_Pt(38)
        p_title.font.color.rgb = PPTX_RGBColor(15, 23, 42)

        p_sub = tf.add_paragraph()
        p_sub.text = data.subtitle
        p_sub.font.size = PPTX_Pt(20)
        p_sub.font.color.rgb = PPTX_RGBColor(8, 145, 178)

        p_tag = tf.add_paragraph()
        p_tag.text = f"\nSOVRIX Sovereign AI Runtime | On-Premise Asset Reliability | {datetime.utcnow().strftime('%B %Y')}"
        p_tag.font.size = PPTX_Pt(12)
        p_tag.font.color.rgb = PPTX_RGBColor(100, 116, 139)

        # Content Slides
        for s_data in data.slides:
            s = prs.slides.add_slide(blank_layout)
            
            # Slide Header
            head_box = s.shapes.add_textbox(PPTX_Inches(0.8), PPTX_Inches(0.6), PPTX_Inches(11.7), PPTX_Inches(1.0))
            head_tf = head_box.text_frame
            head_p = head_tf.paragraphs[0]
            head_p.text = s_data.get("title", "Technical Analysis").upper()
            head_p.font.bold = True
            head_p.font.size = PPTX_Pt(24)
            head_p.font.color.rgb = PPTX_RGBColor(15, 23, 42)

            # Body Box
            body_box = s.shapes.add_textbox(PPTX_Inches(0.8), PPTX_Inches(1.8), PPTX_Inches(11.7), PPTX_Inches(5.0))
            body_tf = body_box.text_frame
            body_tf.word_wrap = True

            bullets = s_data.get("bullets", [])
            for idx, b in enumerate(bullets):
                bp = body_tf.add_paragraph() if idx > 0 else body_tf.paragraphs[0]
                bp.text = f"•  {b}"
                bp.font.size = PPTX_Pt(16)
                bp.font.color.rgb = PPTX_RGBColor(51, 65, 85)
                bp.space_after = PPTX_Pt(14)

        prs.save(file_path)
        file_size = file_path.stat().st_size

        return DeliverableOut(
            id=doc_id,
            title=data.title,
            file_type="PPTX",
            filename=filename,
            download_url=f"/api/v1/deliverables/download/{filename}",
            file_size_bytes=file_size,
            created_at=datetime.utcnow()
        )

    def generate_pdf_report(self, title: str, sections: List[Dict[str, Any]]) -> DeliverableOut:
        doc_id = str(uuid.uuid4())
        filename = f"Sovereign_Technical_Report_{doc_id[:8].upper()}.pdf"
        file_path = self.output_dir / filename

        doc = SimpleDocTemplate(str(file_path), pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'SovrixTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=18,
            leading=22,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=12
        )
        h2_style = ParagraphStyle(
            'SovrixH2',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=16,
            textColor=colors.HexColor('#0891B2'),
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'SovrixBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor('#334155'),
            spaceAfter=8
        )

        elements = []
        elements.append(Paragraph(title.upper(), title_style))
        elements.append(Paragraph(f"SOVRIX AIR-GAPPED VERIFIED REPORT | {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}", body_style))
        elements.append(Spacer(1, 10))

        for sec in sections:
            elements.append(Paragraph(sec.get("heading", ""), h2_style))
            elements.append(Paragraph(sec.get("content", ""), body_style))
            elements.append(Spacer(1, 6))

        doc.build(elements)
        file_size = file_path.stat().st_size

        return DeliverableOut(
            id=doc_id,
            title=title,
            file_type="PDF",
            filename=filename,
            download_url=f"/api/v1/deliverables/download/{filename}",
            file_size_bytes=file_size,
            created_at=datetime.utcnow()
        )

deliverable_factory = DeliverableFactory()
