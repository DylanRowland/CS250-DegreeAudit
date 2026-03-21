from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Eagle Eyed Scholar"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PORT: int = 8000
    DATABASE_URL: str = ""

    class Config:
        env_file = ".env"

settings = Settings()