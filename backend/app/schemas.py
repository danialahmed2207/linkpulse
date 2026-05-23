"""
Pydantic-Schemas für LinkPulse.
"""
from pydantic import BaseModel, HttpUrl, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LinkBase(BaseModel):
    original_url: HttpUrl


class LinkCreate(LinkBase):
    pass


class LinkResponse(BaseModel):
    id: int
    owner_id: int
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
