"""
Configuration management for SkillBridge backend.
Loads settings from environment variables using Pydantic settings.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App Configuration
    app_env: str = "development"
    app_name: str = "SkillBridge Backend"
    app_version: str = "0.1.0"

    # Database Configuration
    database_url: str = "postgresql://username:password@localhost:5432/skillbridge"

    # API Configuration
    api_prefix: str = "/api/v1"

    # CORS Configuration
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # JWT Configuration (placeholder for future auth)
    jwt_secret: Optional[str] = None
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    def get_cors_origins_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
