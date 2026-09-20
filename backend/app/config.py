import os
from typing import Dict, Any
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered GeoSpatial Site Readiness Analyzer"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]
    
    # Database Configuration (PostgreSQL + PostGIS or SQLite fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./geoready.db")
    POSTGIS_ENABLED: bool = os.getenv("POSTGIS_ENABLED", "false").lower() in ("true", "1")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "geoready_super_secret_jwt_key_2026")
    
    # AI / LLM Integration (NVIDIA NIM or generic OpenAI-compatible API)
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")
    NVIDIA_API_URL: str = os.getenv(
        "NVIDIA_API_URL", 
        "https://integrate.api.nvidia.com/v1/chat/completions"
    )
    NVIDIA_MODEL: str = os.getenv(
        "NVIDIA_MODEL", 
        "meta/llama-3.2-11b-vision-instruct"
    )

    # Scoring Algorithm Config
    ALGORITHM_VERSION: str = "score-v1.0"
    
    # Business Profiles Default Weights
    DEFAULT_PROFILES: Dict[str, Dict[str, float]] = {
        "retail": {
            "population": 0.30,
            "accessibility": 0.25,
            "competition": 0.15,
            "land_use": 0.15,
            "risk": 0.15,
        },
        "warehouse": {
            "population": 0.10,
            "accessibility": 0.40,
            "competition": 0.10,
            "land_use": 0.25,
            "risk": 0.15,
        },
        "ev_charging": {
            "population": 0.20,
            "accessibility": 0.35,
            "competition": 0.20,
            "land_use": 0.15,
            "risk": 0.10,
        },
        "telecom": {
            "population": 0.35,
            "accessibility": 0.15,
            "competition": 0.10,
            "land_use": 0.20,
            "risk": 0.20,
        },
        "renewable_energy": {
            "population": 0.05,
            "accessibility": 0.20,
            "competition": 0.05,
            "land_use": 0.40,
            "risk": 0.30,
        },
    }

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
