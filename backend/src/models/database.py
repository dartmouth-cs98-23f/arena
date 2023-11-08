import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.types import Date
from sqlalchemy.orm import relationship, mapped_column, Mapped, relationship
from typing import List, Optional
from sqlalchemy.dialects import postgresql
from sqlalchemy import Column, String

import motor.motor_asyncio
import asyncio
from uuid import uuid4

from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

ARENA_DATABASE = "arena-mongo"
DB_BETS = "bets"
DB_ODDS = "odds"

SQLALCHEMY_DATABASE_URL = os.getenv("DB_CONN")
MONGO_DATABASE_URL = os.getenv("MONGO_URI")

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False,
                            autoflush=False,
                            bind=engine)

def get_mongo():
    try:
<<<<<<< HEAD
        db = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DATABASE_URL)
        yield db[ARENA_DATABASE]
=======
        db = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DATABASE_URL)[ARENA_DATABASE]
        yield db
>>>>>>> 40f3c88 (Ability to create bet (#46))
    finally:
        db.close()

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


class Key(Base):
    """
    Key
    specifies API keys
    """

    __tablename__ = "Key"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    key = Column(String(256), index=True)
    created = Column(Date)

    user_id = Column(postgresql.UUID(as_uuid=True))

    # many to one relationship
    utilization:Mapped[List["KeyUse"]] = relationship(back_populates="parent")


class KeyUse(Base):
    """
    KeyUse
    New row is created in this column everytime an API key is utilized. Keeps track
    of who used the API key and when
    """
    __tablename__ = "KeyUse"

    id:Mapped[int] = mapped_column(primary_key=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey("Key.id"))
    parent: Mapped["Key"] = relationship(back_populates="utilization")

    date = Column(Date)


class User(Base):
    __tablename__ = 'User'

    id = Column(
        postgresql.UUID(as_uuid=True),
        primary_key=True,
        index=True,
        default=uuid4)

    first_name = Column(String(256))
    last_name = Column(String(256))
    email = Column(String(256))
    google_id = Column(String(1024))
    api_token = Column(String(1024))
<<<<<<< HEAD
    balance = Column(Integer, default=500)

=======
>>>>>>> 40f3c88 (Ability to create bet (#46))

def get_user(api_key, db) -> Optional[User]:
    api_key = db.query(Key).filter(Key.key == api_key).first()
    if not api_key:
        return None
    user = db.query(User).filter(User.id == api_key.user_id).first()
    if not user:
        return None
    return user

