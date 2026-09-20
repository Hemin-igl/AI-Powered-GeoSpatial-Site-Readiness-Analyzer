from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class HotspotFeature(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: Dict[str, Any]

class HotspotsResponse(BaseModel):
    type: str = "FeatureCollection"
    algorithm: str
    layer: str
    feature_count: int
    features: List[HotspotFeature]
