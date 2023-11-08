from uuid import uuid4
from fastapi import APIRouter, Depends
from fastapi.security.api_key import APIKey

from backend.src.models.database import get_mongo, get_db, DB_BETS, get_user
from backend.src.schemas.bets import BetCreateContext
from backend.src.schemas.index import Success
from backend.src.auth import get_api_key

from interfaces.bets_pb2 import Bet

from datetime import timezone 
import datetime 
from google.protobuf.json_format import MessageToDict
from google.protobuf.timestamp_pb2 import Timestamp

router = APIRouter()

@router.post("/create")
async def create(context:BetCreateContext,
                 db = Depends(get_db),
                 mongo = Depends(get_mongo), 
                 api_key:APIKey = Depends(get_api_key)) -> Success:
    user = get_user(api_key, db)
    if not user:
        return Success(ok=False, error="Cannot find the user associated with the API key", message="")

    dt = datetime.datetime.now(timezone.utc) 
    
    utc_time = dt.replace(tzinfo=timezone.utc) 
    utc_timestamp = utc_time.timestamp() 
    print("TIMESTAMP: ", utc_timestamp)

    bet = Bet(
        uuid = str(uuid4()),
        creator_uuid = str(user.id),
        title = context.title,
        description = context.description,
        verifier_uuid = "None",
        timestamp = Timestamp(seconds=int(utc_timestamp)),
    )
    
    bet_json = MessageToDict(bet)

    try:
        result = await mongo[DB_BETS].insert_one(bet_json)
        bet_id = result.inserted_id
        return Success(ok=True, error=None, message=str(bet_id))
    except Exception as ex:
        return Success(ok=False, error=str(ex), message="Failed to create bet") 
