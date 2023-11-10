from fastapi import APIRouter, Depends
from fastapi.security.api_key import APIKey 

from backend.src.auth import get_api_key
from backend.src.models.database import get_db, get_user

from backend.src.schemas.users import BalanceResponse
from backend.src.schemas.index import Success

router = APIRouter() 

@router.get("/balance")
async def user_balance(
    db = Depends(get_db),
    api_key:APIKey = Depends(get_api_key)) -> BalanceResponse:
    user = get_user(api_key, db)
    if not user:
        return BalanceResponse(
            success = Success(ok=False,
                              error="Could not find the user",
                              message=""), 
            balance=0.0)
    return BalanceResponse(
        success = Success(ok=True,
                          error=None,
                          message=""),
        balance=user.balance)
    
    