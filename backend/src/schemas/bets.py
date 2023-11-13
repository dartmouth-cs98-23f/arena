from pydantic import BaseModel, Json
from pydantic.dataclasses import dataclass

from typing import Optional, List

from backend.src.schemas.index import Success

class BetsResponse(BaseModel):
    success: Success
    bets: Optional[Json[any]]

    class Config:
        arbitrary_types_allowed = True

class BetCreateContext(BaseModel):
    title: str
    description: str
    win_justification: str
    verifier_uuid: str
    odds: float

class BetsGetContext(BaseModel):
    timestamp: int
    limit: int
    page: int

class OddsScheme(BaseModel):
    odds: float
    timestamp: int

class OddsResponse(BaseModel):
    success: Success
    odds: List[OddsScheme]

class WagerCreateContext(BaseModel):
    amount: int
    yes: bool
    bet_uuid: str
    
class BetResponse(BaseModel):
    success: Success
    bet: Optional[Json[any]]

    class Config:
        arbitrary_types_allowed = True

class BetSettlement(BaseModel):
    bet_uuid: str
    outcome: bool
