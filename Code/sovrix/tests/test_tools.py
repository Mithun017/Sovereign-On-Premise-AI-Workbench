import pytest
import asyncio
from app.services.tools.registry import tool_registry

@pytest.mark.asyncio
async def test_ocr_tool():
    tool = tool_registry.get_tool("OCRTool")
    assert tool is not None
    res = await tool.run({"document_name": "IR-2026-8924.pdf"})
    assert res["success"] is True
    assert "3.42 mm" in res["extracted_text"]
    assert res["network_calls"] == 0

@pytest.mark.asyncio
async def test_calculator_tool():
    tool = tool_registry.get_tool("CalculatorTool")
    assert tool is not None
    res = await tool.run({
        "expression": "Deficit = MAWT - Measured",
        "variables": {"mawt": 4.50, "measured": 3.42},
        "unit": "mm"
    })
    assert res["success"] is True
    assert res["final_result"] == 1.08
    assert res["is_verified"] is True

@pytest.mark.asyncio
async def test_python_sandbox_tool():
    tool = tool_registry.get_tool("PythonSandboxTool")
    assert tool is not None
    res = await tool.run({
        "code": "a = 10\nb = 20\nprint(f'SUM={a+b}')",
        "tests": ["assert True"]
    })
    assert res["success"] is True
    assert "SUM=30" in res["stdout"]
    assert "DENIED" in res["network_status"]
