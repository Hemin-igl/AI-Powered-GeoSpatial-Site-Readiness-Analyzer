from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class DecayConfig(BaseModel):
    type: str = "exponential"  # "exponential" | "power" | "linear"
    k: float = 0.5

class CompetitionAnalyzeRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    radius_km: float = Field(default=5.0, gt=0.0, le=50.0)
    decay: Optional[DecayConfig] = Field(default_factory=DecayConfig)
    category: Optional[str] = "retail"

class CompetitorItem(BaseModel):
    id: str
    name: str
    category: str
    distance_km: float
    decay_weight: float
    coordinates: List[float]  # [lng, lat]

class CompetitionAnalyzeResponse(BaseModel):
    center: List[float]
    radius_km: float
    competitor_count: int
    total_pressure: float
    normalized_score: float
    competitors: List[CompetitorItem]
