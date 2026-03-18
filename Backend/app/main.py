from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, resume, analyze, history, profile
import app.models.user
import app.models.resume

# Create all database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI Resume Analyzer",
    description="Upload your resume and get AI powered analysis against job descriptions",
    version="1.0.0"
)

# ─── CORS Settings ────────────────────────────────────────────
# Allows your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # Alternative React port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register all routes ──────────────────────────────────────
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(analyze.router)
app.include_router(history.router)
app.include_router(profile.router)

# ─── Root endpoint ────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "AI Resume Analyzer API is running!",
        "docs": "Visit /docs for interactive API documentation"
    }