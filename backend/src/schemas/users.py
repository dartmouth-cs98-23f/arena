from pydantic import BaseModel

from backend.src.schemas.index import Success

class BalanceResponse(BaseModel):
    success: Success
    balance: int