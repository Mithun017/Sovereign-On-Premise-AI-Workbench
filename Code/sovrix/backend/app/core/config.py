import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SOVRIX - Sovereign On-Premise AI Workbench"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Air-Gap and Sovereignty Flags
    AIR_GAPPED_MODE: bool = True
    ALLOW_EXTERNAL_CALLS: bool = False
    EXTERNAL_API_CALLS_COUNT: int = 0
    
    # Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "sovrix-sovereign-secure-key-2026-industrial-defense")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Storage paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    OUTPUT_DIR: Path = BASE_DIR / "generated_deliverables"
    DATA_DIR: Path = BASE_DIR / "app" / "data"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{BASE_DIR}/sovrix_enterprise.db"
    )
    
    # Sandboxed Execution Settings
    SANDBOX_TIMEOUT_SECONDS: int = 15
    SANDBOX_MAX_MEMORY_MB: int = 512
    SANDBOX_NETWORK_ISOLATION: bool = True
    
    # Local Inference defaults
    DEFAULT_OLLAMA_ENDPOINT: str = os.getenv("OLLAMA_ENDPOINT", "http://127.0.0.1:11434")
    DEFAULT_VLLM_ENDPOINT: str = os.getenv("VLLM_ENDPOINT", "http://127.0.0.1:8000/v1")
    DEFAULT_LLAMACPP_ENDPOINT: str = os.getenv("LLAMACPP_ENDPOINT", "http://127.0.0.1:8080")
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure critical directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
