import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # Supports comma-separated keys for round-robin pooling, e.g. "key1,key2,key3"
    gemini_api_key: str = ""
    news_api_key: str = ""
    alpha_vantage_api_key: str = ""
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
