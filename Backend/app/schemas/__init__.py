from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
    Token,
    TokenData
)
from app.schemas.resume import (
    AnalysisRequest,
    AnalysisResult,
    AnalysisResponse,
    ResumeResponse,
    HistoryItem,
    Recommendation
)

# ```

# ---

# ## ✅ Your schemas/ folder should now look like:
# ```
# schemas/
# ├── __init__.py   ← imports everything
# ├── user.py       ← UserCreate, UserLogin, UserResponse, Token
# └── resume.py     ← AnalysisRequest, AnalysisResult, AnalysisResponse
# ```

# ---

# ### 💡 How Schemas protect your API
# ```
# Frontend sends messy data          Schema validates it
# ──────────────────────             ──────────────────
# { email: "notanemail" }     →      ❌ rejected instantly
# { email: "a@b.com" }        →      ✅ passes through
# { password: "" }            →      ❌ rejected (empty)
# { extra_field: "hack" }     →      ✅ ignored safely