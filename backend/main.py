from fastapi import FastAPI
from app.core.startup import configure_app

app = FastAPI(title="Eagle-Eyed Scholars")
configure_app(app)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}