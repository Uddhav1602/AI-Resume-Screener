from app.models.user import User
from app.models.resume import Resume, Analysis


# ```

# > This makes imports cleaner everywhere else in the project.

# ---

# ## ✅ Quick Verify

# Your `app/models/` folder should now have:
# ```
# models/
# ├── __init__.py   ← imports User, Resume, Analysis
# ├── user.py       ← users table
# └── resume.py     ← resumes + analyses tables