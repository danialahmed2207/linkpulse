"""
LinkPulse API — URL-Shortener mit Analytics.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Tabellen automatisch erstellen (für Dev; in Prod Alembic verwenden)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LinkPulse API",
    description="Professioneller URL-Shortener mit Analytics",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "LinkPulse API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
