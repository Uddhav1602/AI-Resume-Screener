from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Gemini AI
    gemini_api_key: str

    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Database
    database_url: str

    # File Upload
    upload_dir: str = "uploads"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()