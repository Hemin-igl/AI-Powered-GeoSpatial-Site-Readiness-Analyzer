from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class OpportunityFilters(BaseModel):
    population: Optional[str] = "high"  # high, medium, low
    competition: Optional[str] = "low"
    accessibility: Optional[str] = "high"
    risk: Optional[str] = "low"

class OpportunitySearchRequest(BaseModel):
    business_type: str = "retail"
    minimum_score: float = Field(default=70.0, ge=0.0, le=100.0)
    filters: Optional[OpportunityFilters] = None
    center: Optional[List[float]] = None  # [lng, lat]
    radius_km: Optional[float] = 10.0

class OpportunityZone(BaseModel):
    id: str
    score: float
    center: List[float]  # [longitude, latitude]
    geometry: Dict[str, Any]
    factors: Dict[str, float]
    metrics: Optional[Dict[str, Any]] = None

class OpportunitySearchResponse(BaseModel):
    zones: List[OpportunityZone]
