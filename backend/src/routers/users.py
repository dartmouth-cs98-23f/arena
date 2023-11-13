from fastapi import APIRouter, Depends
from fastapi.security.api_key import APIKey 

from backend.src.auth import get_api_key
from backend.src.models.database import get_db, get_mongo, get_user, DB_ODDS, DB_WAGERS

from backend.src.schemas.users import BalanceResponse, WagersResponse, BalanceAddContext
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
    
    
@router.get("/wagers")
async def wagers(
    betUuid:str,
    mongo = Depends(get_mongo),
    db = Depends(get_db),
    api_key:APIKey = Depends(get_api_key)) -> WagersResponse:
    user = get_user(api_key, db)
    if not user:
        return WagersResponse(
            success = Success(ok=False,
                              error="Could not find the user",
                              message=""),
            yes=0,
            no=0)
    cursor = mongo[DB_WAGERS].find({"betUuid": betUuid, "userUuid": str(user.id)})
    documents = await cursor.to_list(length=1000000)
    
    yes = 0
    no = 0
    for doc in documents:
        yes += 1 if doc["yes"] else 0
        no += 1 if not doc["yes"] else 0

    return WagersResponse(
        success = Success(ok=True,
                          error=None,
                          message=""),
        yes = yes,
        no = no,
    )
        
@router.post("/balance")
async def user_balance_add(
    balanceAddContext:BalanceAddContext,
    db = Depends(get_db),
    api_key: APIKey = Depends(get_api_key)) -> BalanceResponse:
    user = get_user(api_key, db)
    if not user:
        return BalanceResponse(
            success = Success(ok=False,
                              error="Could not find the user",
                              message=""),
            balance=0.0)

    user.balance += balanceAddContext.additional_balance
    db.commit()

    return BalanceResponse(
        success = Success(ok=True,
                          error=None,
                          message=f"Added {balanceAddContext.additional_balance} to user balance"),
        balance = user.balance,
    )
