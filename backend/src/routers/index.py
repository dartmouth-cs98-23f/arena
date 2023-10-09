from fastapi import APIRouter

from backend.src.schemas.index import Success

router = APIRouter()

@router.get("/")
async def index() -> Success:
    return Success(ok=True,
                   message = "Hello world")