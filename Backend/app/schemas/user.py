from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# When user registers → this is what we expect from frontend
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# When user logs in → this is what we expect
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# What we send BACK to frontend (never send password!)
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

# Update profile
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

# JWT Token response
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
# ```

# ---

# ### 💡 What are Schemas and why different from Models?

# This is a very common confusion — here's the clear difference:
# ```
# Models  (app/models/)   → define DATABASE tables (SQLAlchemy)
# Schemas (app/schemas/)  → define API data shape (Pydantic)

# Models  = what's STORED in database
# Schemas = what's SENT/RECEIVED through API
# ```

# Real example:
# ```
# User registers → sends { name, email, password }  ← UserCreate schema validates this
#                          ↓
# Backend hashes password, saves to DB               ← User model saves this
#                          ↓
# Response sent back → { id, name, email, created_at } ← UserResponse schema (NO password!)