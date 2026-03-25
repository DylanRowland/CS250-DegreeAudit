from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Eagle Eyed Scholar"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PORT: int = 8000
    # DATABASE_URL will be needed if translated from JSON files to SQL
    # DATABASE_URL: str = ""
    R2_ACCESS_KEY: str = ""
    R2_SECRET_KEY: str = ""
    R2_ENDPOINT_URL: str = ""
    R2_BUCKET_NAME: str = ""

    class Config:
        env_file = ".env"

settings = Settings()