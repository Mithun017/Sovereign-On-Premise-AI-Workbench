from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseTool(ABC):
    def __init__(self, name: str, description: str, category: str = "general"):
        self.name = name
        self.description = description
        self.category = category

    @abstractmethod
    async def run(self, params: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute tool operation and return structured result"""
        pass
