from typing import Dict, List, Optional
from app.services.tools.base import BaseTool
from app.services.tools.tools_impl import (
    FileReadTool,
    FileWriteTool,
    DirectoryTool,
    OCRTool,
    VisionTool,
    PDFTool,
    DocumentSearchTool,
    KnowledgeBaseTool,
    PythonSandboxTool,
    CodeExecutionTool,
    CalculatorTool,
    WordTool,
    ExcelTool,
    PowerPointTool,
    ImageAnalysisTool,
)

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}
        self._register_default_tools()

    def _register_default_tools(self):
        default_tool_instances = [
            FileReadTool(),
            FileWriteTool(),
            DirectoryTool(),
            OCRTool(),
            VisionTool(),
            PDFTool(),
            DocumentSearchTool(),
            KnowledgeBaseTool(),
            PythonSandboxTool(),
            CodeExecutionTool(),
            CalculatorTool(),
            WordTool(),
            ExcelTool(),
            PowerPointTool(),
            ImageAnalysisTool(),
        ]
        for tool in default_tool_instances:
            self.register(tool)

    def register(self, tool: BaseTool):
        self._tools[tool.name] = tool

    def get_tool(self, name: str) -> Optional[BaseTool]:
        return self._tools.get(name)

    def list_tools(self) -> List[Dict[str, str]]:
        return [
            {
                "name": t.name,
                "description": t.description,
                "category": t.category
            }
            for t in self._tools.values()
        ]

tool_registry = ToolRegistry()
