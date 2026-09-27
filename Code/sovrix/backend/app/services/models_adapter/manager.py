from typing import Dict, Any, Optional, List
from app.services.models_adapter.base import BaseModelAdapter
from app.services.models_adapter.adapters import (
    OllamaAdapter, VLLMAdapter, LlamaCppAdapter, SovereignLocalEngine
)

class ModelAdapterManager:
    """
    Manages local model adapter instances across Ollama, vLLM, llama.cpp, and Sovereign Local Engine.
    Enables pluggable additions without modifying agent internals.
    """
    def __init__(self):
        self._cached_adapters: Dict[str, BaseModelAdapter] = {}

    def get_adapter(
        self, 
        provider: str, 
        model_id: str, 
        endpoint: str, 
        context_length: int = 32768
    ) -> BaseModelAdapter:
        cache_key = f"{provider}:{model_id}:{endpoint}"
        if cache_key in self._cached_adapters:
            return self._cached_adapters[cache_key]

        provider_lower = provider.lower()
        if provider_lower == "ollama":
            adapter = OllamaAdapter(endpoint=endpoint, model_id=model_id, context_length=context_length)
        elif provider_lower == "vllm":
            adapter = VLLMAdapter(endpoint=endpoint, model_id=model_id, context_length=context_length)
        elif provider_lower in ["llamacpp", "llama.cpp"]:
            adapter = LlamaCppAdapter(endpoint=endpoint, model_id=model_id, context_length=context_length)
        else:
            adapter = SovereignLocalEngine(endpoint=endpoint, model_id=model_id, context_length=context_length)

        self._cached_adapters[cache_key] = adapter
        return adapter

model_manager = ModelAdapterManager()
