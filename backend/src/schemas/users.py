from pydantic import BaseModel

from backend.src.schemas.index import Success
from typing import Optional

class BalanceAddContext(BaseModel): 
    additional_balance: int

class BalanceResponse(BaseModel):
    success: Success
    balance: int

class WagersResponse(BaseModel):
    success: Success
    yes: int
    no: int

class CondensedUser(BaseModel):
    email: str
    uuid: str

class UserResponse(BaseModel): 
    success: Success
    user: Optional[CondensedUser]
    