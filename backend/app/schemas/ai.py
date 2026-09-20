from typing import Optional, Dict, Any
from pydantic import BaseModel

class AIExplainRequest(BaseModel):
    analysis: Dict[str, Any]
    question: Optional[str] = "Why does this site have this score?"

class AIExplainResponse(BaseModel):
    explanation: str
    grounded_facts: Dict[str, Any]
    model: str
    status: str = "success"
