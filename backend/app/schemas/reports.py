from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class ReportGenerateRequest(BaseModel):
    site_analysis: Dict[str, Any]
    site_name: Optional[str] = "Candidate Site Evaluation"
    business_type: Optional[str] = "retail"
    notes: Optional[str] = None

class ReportGenerateResponse(BaseModel):
    report_id: str
    title: str
    created_at: str
    score: float
    status: str
    summary_markdown: str
    factors: Dict[str, float]
    metrics: Dict[str, Any]
    recommendations: List[str]
