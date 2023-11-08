from pydantic import BaseModel, Json
from pydantic.dataclasses import dataclass

from typing import Optional

from backend.src.schemas.index import Success

class Bets(BaseModel):
    success: Success
    bet: Json[any]

    class Config:
        arbitrary_types_allowed = True

class BetCreateContext(BaseModel):
    title: str
    description: str
    win_justification: str
    verifier_uuid: str
