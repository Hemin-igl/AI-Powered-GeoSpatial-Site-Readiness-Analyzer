from fastapi import APIRouter
from ...schemas.accessibility import IsochroneRequest, IsochroneResponse
from ...services.accessibility import AccessibilityService

router = APIRouter(tags=["Accessibility"])

@router.post("/accessibility/isochrone", response_model=IsochroneResponse)
def get_isochrone(req: IsochroneRequest):
    return AccessibilityService.calculate_isochrones(req)
