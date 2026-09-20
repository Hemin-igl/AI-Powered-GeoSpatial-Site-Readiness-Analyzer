from fastapi import APIRouter
from ...schemas.competition import CompetitionAnalyzeRequest, CompetitionAnalyzeResponse
from ...services.competition import CompetitionService

router = APIRouter(tags=["Competition"])

@router.post("/competition/analyze", response_model=CompetitionAnalyzeResponse)
def analyze_competition(req: CompetitionAnalyzeRequest):
    return CompetitionService.analyze_competition(req)
