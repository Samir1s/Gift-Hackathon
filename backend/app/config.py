import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    gemini_api_key: str = ""
    news_api_key: str = ""
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
