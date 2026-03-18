from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.resume import Analysis, Resume
from app.routes.auth import get_logged_in_user
import json

router = APIRouter(prefix="/history", tags=["History"])

# ─── Get all analyses for current user ───────────────────────
@router.get("/")
def get_history(
    current_user: User = Depends(get_logged_in_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).all()

    history = []
    for analysis in analyses:
        # Get the resume filename
        resume = db.query(Resume).filter(
            Resume.id == analysis.resume_id
        ).first()

        history.append({
            "id": analysis.id,
            "resume_id": analysis.resume_id,
            "filename": resume.filename if resume else "Unknown",
            "match_score": analysis.match_score,
            "created_at": analysis.created_at
        })

    return history

# ─── Get single analysis by ID ────────────────────────────────
@router.get("/{analysis_id}")
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_logged_in_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    # Get resume info
    resume = db.query(Resume).filter(
        Resume.id == analysis.resume_id
    ).first()

    return {
        "id": analysis.id,
        "resume_id": analysis.resume_id,
        "filename": resume.filename if resume else "Unknown",
        "job_description": analysis.job_description,
        "match_score": analysis.match_score,
        "ai_response": json.loads(analysis.ai_response),
        "created_at": analysis.created_at
    }

# ─── Delete analysis ──────────────────────────────────────────
@router.delete("/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_logged_in_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    db.delete(analysis)
    db.commit()
    return {"message": "Analysis deleted successfully"}