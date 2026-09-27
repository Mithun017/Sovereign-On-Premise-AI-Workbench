from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, AsyncGenerator

class BaseModelAdapter(ABC):
    def __init__(self, endpoint: str, model_id: str, context_length: int = 32768):
        self.endpoint = endpoint
        self.model_id = model_id
        self.context_length = context_length

    @abstractmethod
    async def generate_response(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 4096,
        images_base64: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Execute local completion"""
        pass

    @abstractmethod
    async def stream_response(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        images_base64: Optional[List[str]] = None
    ) -> AsyncGenerator[str, None]:
        """Stream local response tokens"""
        pass

    @abstractmethod
    async def check_health(self) -> Dict[str, Any]:
        """Verify local endpoint connectivity"""
        pass
