from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Analysis
from app.schemas.user import UserResponse
from app.routes.auth import get_logged_in_user

router = APIRouter(prefix="/profile", tags=["Profile"])

# ─── Get profile with stats ───────────────────────────────────
@router.get("/")
def get_profile(
    current_user: User = Depends(get_logged_in_user),
    db: Session = Depends(get_db)
):
    # Count total analyses done by user
    total_analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).count()

    # Get highest match score ever
    best_analysis = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.match_score.desc()).first()

    # Get average match score
    all_analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).all()

    avg_score = 0
    if all_analyses:
        avg_score = sum(a.match_score for a in all_analyses) / len(all_analyses)

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at,
        "stats": {
            "total_analyses": total_analyses,
            "best_match_score": best_analysis.match_score if best_analysis else 0,
            "average_match_score": round(avg_score, 2)
        }
    }