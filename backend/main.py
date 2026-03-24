from fastapi import FastAPI
from app.core.startup import configure_app
from app.api.v1.routes import api_v1_router

app = FastAPI(title="Eagle-Eyed Scholars")
configure_app(app)

app.include_router(api_v1_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
