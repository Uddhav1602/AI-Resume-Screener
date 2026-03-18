from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse
from app.routes.auth import get_logged_in_user
from app.config import get_settings
import os
import uuid

settings = get_settings()
router = APIRouter(prefix="/resume", tags=["Resume"])

# ─── Upload Resume ────────────────────────────────────────────
@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_logged_in_user),
    db: Session = Depends(get_db)
):
    # Only allow PDF files
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Create uploads folder if it doesn't exist
    os.makedirs(settings.upload_dir, exist_ok=True)

    # Give file a unique name to avoid conflicts
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.upload_dir, unique_filename)

    # Save file to disk
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Save file info to database
    new_resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume

# ─── Get all resumes for current user ────────────────────────
@router.get("/my-resumes")
def get_my_resumes(
    current_user: User = Depends(get_logged_in_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).all()
    return resumes