from fastapi import APIRouter
from ...schemas.health import HealthResponse
from ...config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse(status="ok", version=settings.VERSION)
