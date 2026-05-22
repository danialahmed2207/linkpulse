"""
API-Router für Link-Operationen.
"""
import io
import base64
import qrcode
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/links", tags=["links"])


def get_base_url(request: Request):
    return str(request.base_url).rstrip("/")


@router.get("/", response_model=List[schemas.LinkResponse])
def read_links(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), request: Request = None):
    """Alle Links abrufen."""
    links = crud.get_links(db, skip=skip, limit=limit)
    base = get_base_url(request)
    for link in links:
        link.short_url = f"{base}/{link.short_code}"
    return links


@router.post("/", response_model=schemas.LinkResponse, status_code=201)
def create_link(link: schemas.LinkCreate, db: Session = Depends(get_db), request: Request = None):
    """Neuen Shortlink erstellen."""
    db_link = crud.create_link(db, link=link)
    db_link.short_url = f"{get_base_url(request)}/{db_link.short_code}"
    return db_link


@router.get("/{link_id}", response_model=schemas.LinkResponse)
def read_link(link_id: int, db: Session = Depends(get_db), request: Request = None):
    """Einzelnen Link abrufen."""
    link = db.query(crud.models.Link).filter(crud.models.Link.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link nicht gefunden")
    link.short_url = f"{get_base_url(request)}/{link.short_code}"
    return link


@router.delete("/{link_id}")
def delete_link(link_id: int, db: Session = Depends(get_db)):
    """Link löschen."""
    deleted = crud.delete_link(db, link_id=link_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Link nicht gefunden")
    return {"message": "Link erfolgreich gelöscht"}


# Redirect Router (ohne Prefix /links)
redirect_router = APIRouter(tags=["redirect"])


@redirect_router.get("/{short_code}")
def redirect_link(short_code: str, db: Session = Depends(get_db)):
    """Weiterleitung zum Original-URL."""
    link = crud.get_link_by_code(db, short_code=short_code)
    if not link or not link.is_active:
        raise HTTPException(status_code=404, detail="Shortlink nicht gefunden")
    crud.increment_clicks(db, link.id)
    return RedirectResponse(url=link.original_url)


@redirect_router.get("/{short_code}/stats", response_model=schemas.LinkStats)
def link_stats(short_code: str, db: Session = Depends(get_db), request: Request = None):
    """Statistiken für einen Shortlink abrufen."""
    link = crud.get_link_by_code(db, short_code=short_code)
    if not link:
        raise HTTPException(status_code=404, detail="Shortlink nicht gefunden")

    # QR-Code generieren
    qr = qrcode.make(f"{get_base_url(request)}/{link.short_code}")
    buf = io.BytesIO()
    qr.save(buf, format="PNG")
    qr_base64 = base64.b64encode(buf.getvalue()).decode()

    return schemas.LinkStats(
        short_code=link.short_code,
        original_url=link.original_url,
        clicks=link.clicks,
        created_at=link.created_at,
        qr_code=f"data:image/png;base64,{qr_base64}",
    )
