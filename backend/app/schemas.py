"""
Pydantic-Schemas für LinkPulse.
"""
from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional


class LinkBase(BaseModel):
    original_url: HttpUrl


class LinkCreate(LinkBase):
    pass


class LinkResponse(BaseModel):
    id: int
    original_url: str
    short_code: str
    clicks: int
    created_at: datetime
    is_active: bool
    short_url: str

    class Config:
        from_attributes = True


class LinkStats(BaseModel):
    short_code: str
    original_url: str
    clicks: int
    created_at: datetime
    qr_code: str
