from pydantic import BaseModel

from backend.src.schemas.index import Success

class BalanceAddContext(BaseModel): 
    additional_balance: int

class BalanceResponse(BaseModel):
    success: Success
    balance: int


class WagersResponse(BaseModel):
    success: Success
    yes: int
    no: int