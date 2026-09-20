from fastapi import APIRouter, Query
from typing import Optional
from ...schemas.hotspots import HotspotsResponse
from ...services.hotspot import HotspotService

router = APIRouter(tags=["Hotspots"])

@router.get("/hotspots", response_model=HotspotsResponse)
def get_hotspots(
    algorithm: str = Query("h3", description="Algorithm: h3 | dbscan | gi_star"),
    layer: str = Query("readiness", description="Target layer: population | competition | readiness"),
    latitude: Optional[float] = Query(21.1702, description="Center latitude"),
    longitude: Optional[float] = Query(72.8311, description="Center longitude"),
    radius_km: Optional[float] = Query(8.0, description="Analysis radius in km")
):
    return HotspotService.calculate_hotspots(
        algorithm=algorithm,
        layer=layer,
        center_lat=latitude,
        center_lon=longitude,
        radius_km=radius_km
    )
