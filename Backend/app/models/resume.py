from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Link to analyses
    analyses = relationship("Analysis", back_populates="resume")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    job_description = Column(Text, nullable=False)
    match_score = Column(Float, nullable=True)
    ai_response = Column(Text, nullable=False)  # stored as JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Link back to resume
    resume = relationship("Resume", back_populates="analyses")


# ```

# ---

# ### 💡 What this does:
# ```
# resumes table                    analyses table
# ────────────────                 ──────────────────────
# id                               id
# user_id ──────────────────────→  user_id
# filename                         resume_id ───────────→ resumes.id
# file_path                        job_description
# uploaded_at                      match_score (e.g. 78.5)
#                                  ai_response (full JSON)
#                                  created_at