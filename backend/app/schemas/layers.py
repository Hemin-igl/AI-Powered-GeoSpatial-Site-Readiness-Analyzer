from typing import Optional, Any, Dict, List
from pydantic import BaseModel

class LayerItem(BaseModel):
    id: str
    name: str
    type: str  # polygon, point, raster, heatmap, hex
    feature_count: int
    status: str = "active"
    source: Optional[str] = "GeoSpatial Ingestion Engine"
    metadata: Optional[Dict[str, Any]] = None

class LayersResponse(BaseModel):
    layers: List[LayerItem]
