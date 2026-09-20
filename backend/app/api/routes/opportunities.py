from fastapi import APIRouter
from ...schemas.opportunities import OpportunitySearchRequest, OpportunitySearchResponse
from ...services.opportunities import OpportunityService

router = APIRouter(tags=["Opportunities"])

@router.post("/opportunities/search", response_model=OpportunitySearchResponse)
def search_opportunities(req: OpportunitySearchRequest):
    return OpportunityService.search_opportunities(req)
