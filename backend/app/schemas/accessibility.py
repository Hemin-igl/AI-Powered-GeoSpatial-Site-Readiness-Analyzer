from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class IsochroneRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    mode: str = Field(default="drive")  # "drive" | "walk"
    minutes: List[int] = Field(default=[10, 20, 30])

class IsochroneBand(BaseModel):
    minutes: int
    reachablePopulation: int
    areaSqKm: float
    color: str
    strokeColor: str
    label: str
    geometry: Optional[Dict[str, Any]] = None

class IsochroneResponse(BaseModel):
    center: List[float]  # [lng, lat]
    mode: str
    bands: List[IsochroneBand]
