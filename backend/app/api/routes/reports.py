from fastapi import APIRouter
from ...schemas.reports import ReportGenerateRequest, ReportGenerateResponse
from ...services.reports import ReportsService

router = APIRouter(tags=["Reports"])

@router.post("/reports/generate", response_model=ReportGenerateResponse)
def generate_report(req: ReportGenerateRequest):
    return ReportsService.generate_report(req)
