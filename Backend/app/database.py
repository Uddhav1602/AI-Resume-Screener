from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

# Add timeout so it waits instead of failing immediately
engine = create_engine(
    settings.database_url,
    connect_args={
        "check_same_thread": False,
        "timeout": 30              # ← wait up to 30 seconds if DB is locked
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# ```

# ---

# ## 💡 Why Does This Happen?
# ```
# SQLite = one file on your computer

# VS Code SQLite Viewer opens file  → holds a lock
# FastAPI tries to write            → sees lock → ERROR!

# Solution:
# → Close SQLite Viewer tab when running the server
# → Add timeout so server waits patiently
# ```

# > This is another reason why SQLite is only for development — PostgreSQL handles multiple connections perfectly with no locking issues!

# ---

# ## 📌 Rule Going Forward
# ```
# ✅ View database  → open SQLite Viewer
# ✅ Run server     → close SQLite Viewer tab first