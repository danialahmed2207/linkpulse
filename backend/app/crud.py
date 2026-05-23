"""
CRUD-Operationen für Links und Users.
"""
import random
import string
from sqlalchemy.orm import Session
from app import models, schemas


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def generate_short_code(length: int = 6) -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def get_link_by_code(db: Session, short_code: str):
    return db.query(models.Link).filter(models.Link.short_code == short_code).first()


def get_links(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Link).filter(
        models.Link.owner_id == user_id
    ).order_by(models.Link.created_at.desc()).offset(skip).limit(limit).all()


def create_link(db: Session, link: schemas.LinkCreate, user_id: int):
    short_code = generate_short_code()
    while get_link_by_code(db, short_code):
        short_code = generate_short_code()

    db_link = models.Link(
        original_url=str(link.original_url),
        short_code=short_code,
        owner_id=user_id,
    )
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link


def increment_clicks(db: Session, link_id: int):
    db_link = db.query(models.Link).filter(models.Link.id == link_id).first()
    if db_link:
        db_link.clicks += 1
        db.commit()
        db.refresh(db_link)
    return db_link


def delete_link(db: Session, link_id: int, user_id: int):
    db_link = db.query(models.Link).filter(
        models.Link.id == link_id,
        models.Link.owner_id == user_id
    ).first()
    if not db_link:
        return None
    db.delete(db_link)
    db.commit()
    return db_link
