import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import motor.motor_asyncio

SQLALCHEMY_DATABASE_URL = os.getenv("DB_CONN")
MONGO_DATABASE_URL = os.getenv("MONGO_URI")

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False,
                            autoflush=False,
                            bind=engine)

mongo_db = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DATABASE_URL)

Base = declarative_base()

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()