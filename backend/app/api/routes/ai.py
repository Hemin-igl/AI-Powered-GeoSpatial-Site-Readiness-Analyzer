from fastapi import APIRouter
from ...schemas.ai import AIExplainRequest, AIExplainResponse
from ...services.ai import AIService

router = APIRouter(tags=["AI"])

@router.post("/ai/explain", response_model=AIExplainResponse)
async def explain_site(req: AIExplainRequest):
    return await AIService.explain_analysis(req)
