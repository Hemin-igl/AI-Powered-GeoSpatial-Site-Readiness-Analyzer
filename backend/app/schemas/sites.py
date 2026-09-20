from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ScoringWeights(BaseModel):
    population: float = Field(default=0.30, ge=0.0, le=1.0)
    accessibility: float = Field(default=0.25, ge=0.0, le=1.0)
    competition: float = Field(default=0.15, ge=0.0, le=1.0)
    land_use: float = Field(default=0.15, ge=0.0, le=1.0)
    risk: float = Field(default=0.15, ge=0.0, le=1.0)

class SiteAnalysisRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    business_type: str = Field(default="retail")
    radius_km: float = Field(default=5.0, gt=0.0, le=50.0)
    weights: Optional[ScoringWeights] = None

class FactorScores(BaseModel):
    population: float
    accessibility: float
    competition: float
    land_use: float
    risk: float

class Contributions(BaseModel):
    population: float
    accessibility: float
    competition: float
    land_use: float
    risk: float

class SiteMetrics(BaseModel):
    population_10min: int
    population_20min: int
    population_30min: int
    competitors_1km: int
    competitors_3km: int
    competitors_5km: int
    road_proximity_m: Optional[int] = None
    flood_risk_zone: Optional[str] = None
    zoning_classification: Optional[str] = None

class DataQuality(BaseModel):
    completeness: float = 0.96

class SiteAnalysisResponse(BaseModel):
    site_id: str
    score: float
    factors: FactorScores
    contributions: Contributions
    metrics: SiteMetrics
    constraints: List[str] = []
    data_quality: DataQuality
    algorithm_version: str = "score-v1.0"
    location: Optional[Dict[str, float]] = None
