from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume, Analysis
from app.schemas.resume import AnalysisRequest, AnalysisResponse
from app.routes.auth import get_logged_in_user
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ai_service import analyze_resume
import json

router = APIRouter(prefix="/analyze", tags=["Analysis"])

# ─── Analyze Resume against Job Description ───────────────────
@router.post("/", response_model=AnalysisResponse)
def analyze(
    request: AnalysisRequest,
    current_user: User = Depends(get_logged_in_user),
    db: Session = Depends(get_db)
):
    # Check resume exists and belongs to current user
    resume = db.query(Resume).filter(
        Resume.id == request.resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # Step 1: Extract text from PDF
    resume_text = extract_text_from_pdf(resume.file_path)

    # Step 2: Send to Gemini AI
    ai_result = analyze_resume(resume_text, request.job_description)

    # Step 3: Save analysis to database
    new_analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_description=request.job_description,
        match_score=ai_result.get("match_score", 0),
        ai_response=json.dumps(ai_result)  # store as JSON string
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)

    # Step 4: Return result with parsed JSON
    return AnalysisResponse(
        id=new_analysis.id,
        resume_id=new_analysis.resume_id,
        job_description=new_analysis.job_description,
        match_score=new_analysis.match_score,
        ai_response=ai_result,
        created_at=new_analysis.created_at
    )