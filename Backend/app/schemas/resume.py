from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any

# What frontend sends for analysis
class AnalysisRequest(BaseModel):
    job_description: str
    resume_id: int

# Individual recommendation item
class Recommendation(BaseModel):
    section: str        # e.g. "Skills", "Experience"
    issue: str          # what's missing/wrong
    suggestion: str     # what to change

# Full AI analysis result
class AnalysisResult(BaseModel):
    match_score: float                      # e.g. 78.5
    matched_keywords: List[str]             # keywords found in resume
    missing_keywords: List[str]             # keywords NOT in resume
    recommendations: List[Recommendation]   # detailed suggestions
    overall_summary: str                    # AI summary paragraph

# Resume upload response
class ResumeResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Full analysis response sent to frontend
class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    job_description: str
    match_score: float
    ai_response: Any        # full parsed JSON
    created_at: datetime

    class Config:
        from_attributes = True

# History list item
class HistoryItem(BaseModel):
    id: int
    resume_id: int
    filename: Optional[str] = None
    match_score: float
    created_at: datetime

    class Config:
        from_attributes = True