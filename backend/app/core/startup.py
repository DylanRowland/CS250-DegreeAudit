from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from fastapi import FastAPI

def configure_app(app: FastAPI):
    ## Ensures no one else access website from different port when deployed
    allow_origins = [
        o.strip()
        for o in settings.CORS_ORIGINS.split(",")
        if o.strip()
    ]
    app.add_middleware(CORSMiddleware,
    allow_origins = allow_origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"])

    return app