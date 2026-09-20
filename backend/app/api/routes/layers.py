from fastapi import APIRouter
from ...schemas.layers import LayersResponse
from ...services.layers import LayerService

router = APIRouter(tags=["Layers"])

@router.get("/layers", response_model=LayersResponse)
def get_layers():
    return LayerService.get_layers()
