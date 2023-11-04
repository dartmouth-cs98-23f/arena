from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.types import Date
from sqlalchemy.orm import relationship, mapped_column, Mapped, relationship
from typing import List
from backend.src.models.database import Base

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