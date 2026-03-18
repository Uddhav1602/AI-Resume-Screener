from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from sqlalchemy.orm import Session
from app.config import get_settings
from app.models.user import User
from app.schemas.user import TokenData

settings = get_settings()

# ─── Password Functions ───────────────────────────────────────

def hash_password(password: str) -> str:
    """Convert plain password to hashed version"""
    # Truncate to 72 bytes (bcrypt limit)
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if plain password matches hashed password"""
    password_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

# ─── JWT Token Functions ──────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT token for a logged in user"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm
    )
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    """Verify a JWT token and return the user's email"""
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        email: str = payload.get("sub")
        if email is None:
            return None
        return TokenData(email=email)
    except JWTError:
        return None

# ─── User Functions ───────────────────────────────────────────

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Find a user in DB by their email"""
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Check email + password, return user if valid"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_current_user(db: Session, token: str) -> Optional[User]:
    """Get the currently logged in user from their JWT token"""
    token_data = verify_token(token)
    if token_data is None:
        return None
    user = get_user_by_email(db, token_data.email)
    return user