from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
    get_user_by_email,
    authenticate_user,
    get_current_user
)
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ai_service import analyze_resume

# ```

# ---

# ## ✅ Services folder is now complete:
# ```
# services/
# ├── __init__.py       ← exports everything
# ├── auth_service.py   ← passwords + JWT tokens ✅
# ├── pdf_parser.py     ← extract text from PDF ✅
# └── ai_service.py     ← Gemini AI analysis ✅