from fastapi import APIRouter, Depends, Request
from fastapi.security.api_key import APIKey

from backend.src.auth import get_api_key, get_api_key_from_state
from backend.src.models.database import get_db, get_mongo, get_user, DB_ODDS, DB_WAGERS

from backend.src.schemas.users import (
    BalanceResponse,
    WagersResponse,
    BalanceAddContext,
    CondensedUser,
    UserResponse,
)
from backend.src.schemas.index import Success

from backend.src.models.database import User
import uuid

router = APIRouter()


@router.get("/get_with_uuid")
async def get_with_uuid(request: Request, uuid_query: str) -> UserResponse:
    _ = get_api_key_from_state(request)

    user = (
        request.app.state.db.query(User)
        .filter(User.id == uuid.UUID(uuid_query))
        .first()
    )

    if not user:
        return Userresponse(
            success=Success(ok=False, error="No such user exists", message=""),
            user=None,
        )

    return UserResponse(
        success=Success(ok=True, error=None, message="Found user with UUID given"),
        user=CondensedUser(email=user.email, uuid=str(user.id)),
    )


@router.get("/search")
async def search_for_user(request: Request, email_query: str) -> UserResponse:
    _ = get_api_key_from_state(request)
    user = request.app.state.db.query(User).filter(User.email == email_query).first()
    if not user:
        return UserResponse(
            success=Success(ok=False, error="No such user exists", message=""),
            user=None,
        )

    return UserResponse(
        success=Success(ok=True, error=None, message="Found user with email given"),
        user=CondensedUser(email=user.email, uuid=str(user.id)),
    )

    return UserResponse(
        success=Success(ok=False, error="Failed database initialization", message=""),
        user=None,
    )


@router.get("/balance")
async def user_balance(
    db=Depends(get_db), api_key: APIKey = Depends(get_api_key)
) -> BalanceResponse:
    user = get_user(api_key, db)
    if not user:
        return BalanceResponse(
            success=Success(ok=False, error="Could not find the user", message=""),
            balance=0.0,
        )
    return BalanceResponse(
        success=Success(ok=True, error=None, message=""), balance=user.balance
    )


@router.get("/wagers")
async def wagers(
    betUuid: str,
    mongo=Depends(get_mongo),
    db=Depends(get_db),
    api_key: APIKey = Depends(get_api_key),
) -> WagersResponse:
    user = get_user(api_key, db)
    if not user:
        return WagersResponse(
            success=Success(ok=False, error="Could not find the user", message=""),
            yes=0,
            no=0,
        )
    cursor = mongo[DB_WAGERS].find({"betUuid": betUuid, "userUuid": str(user.id)})
    documents = await cursor.to_list(length=1000000)

    yes = 0
    no = 0
    for doc in documents:
        yes += 1 if doc["yes"] else 0
        no += 1 if not doc["yes"] else 0

    return WagersResponse(
        success=Success(ok=True, error=None, message=""),
        yes=yes,
        no=no,
    )


@router.post("/balance")
async def user_balance_add(
    balanceAddContext: BalanceAddContext,
    db=Depends(get_db),
    api_key: APIKey = Depends(get_api_key),
) -> BalanceResponse:
    user = get_user(api_key, db)
    if not user:
        return BalanceResponse(
            success=Success(ok=False, error="Could not find the user", message=""),
            balance=0.0,
        )

    user.balance += balanceAddContext.additional_balance
    db.commit()

    return BalanceResponse(
        success=Success(
            ok=True,
            error=None,
            message=f"Added {balanceAddContext.additional_balance} to user balance",
        ),
        balance=user.balance,
    )
