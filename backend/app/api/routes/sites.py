from fastapi import APIRouter
from ...schemas.sites import SiteAnalysisRequest, SiteAnalysisResponse
from ...services.scoring import ScoringService

router = APIRouter(tags=["Sites"])

@router.post("/sites/analyze", response_model=SiteAnalysisResponse)
def analyze_site(req: SiteAnalysisRequest):
    return ScoringService.calculate_site_readiness(
        lat=req.latitude,
        lon=req.longitude,
        business_type=req.business_type,
        radius_km=req.radius_km,
        weights=req.weights
    )
