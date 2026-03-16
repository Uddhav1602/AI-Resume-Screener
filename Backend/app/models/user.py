from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ```

# ---

# ### 💡 What this does:
# ```
# This creates the "users" table in your database:

# users
# ├── id             → auto-incremented number (1, 2, 3...)
# ├── name           → user's full name
# ├── email          → unique, used for login
# ├── hashed_password → never store plain passwords!
# └── created_at     → automatically set when user registers