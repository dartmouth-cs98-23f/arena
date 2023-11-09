import random
from uuid import uuid4
from fastapi import APIRouter, Depends
from fastapi.security.api_key import APIKey
from pymongo import DESCENDING
from bson import ObjectId

from backend.src.models.database import get_mongo, get_db,  get_user, DB_BETS, DB_ODDS, DB_WAGERS
from backend.src.schemas.bets import BetCreateContext, BetsResponse, BetsGetContext, OddsResponse, OddsScheme, WagerCreateContext, BetResponse
from backend.src.schemas.index import Success
from backend.src.auth import get_api_key

from interfaces.bets_pb2 import Bet, Odds, Wager

from datetime import timezone 
import datetime 
from google.protobuf.json_format import MessageToDict
from google.protobuf.timestamp_pb2 import Timestamp
from bson.json_util import dumps

router = APIRouter()

@router.post("/wager")
async def create_wager(context:WagerCreateContext,
                       db=Depends(get_db),
                       mongo=Depends(get_mongo),
                       api_key:APIKey = Depends(get_api_key)) -> Success:
    # find the current user
    user = get_user(api_key, db)

    # find the bet the user is wagering on
    cursor = mongo[DB_ODDS]\
            .find({"betUuid": context.bet_uuid})\
            .sort("timestamp", DESCENDING)\
            .limit(1)
    documents = await cursor.to_list(length=1)
    odds_collection = [OddsScheme(odds=float(doc["odds"]), timestamp=int(doc["timestamp"])) for doc in documents]
        
    if len(odds_collection) == 0:
        return Success(ok=False, error="This bet does not exist", message="") 

    # subtract the balance from user
    if not user.balance or user.balance < context.amount:
        return Success(ok=False, error="User does not have enough money", message="")
    user.balance -= context.amount
    db.commit()

    dt = datetime.datetime.now(timezone.utc) 
    utc_time = dt.replace(tzinfo=timezone.utc) 
    utc_timestamp = utc_time.timestamp() 

    # create a bet
    wager = Wager(
        uuid = str(uuid4()),
        bet_uuid = context.bet_uuid,
        yes = context.yes,
        user_uuid = str(user.id),
        tokens = context.amount,
        timestamp = int(utc_timestamp),
        odds = odds_collection[0].odds,
    )

    try:
        wager_json = MessageToDict(wager)

        # these don't get translated properly
        wager_json["timestamp"] = int(utc_timestamp)
        wager_json["yes"] = context.yes

        wager_results = await mongo[DB_WAGERS].insert_one(wager_json)
    except Exception as ex:
        return Success(ok=False, error=str(ex), message="Failed to create wager") 

    # get the last yes bet
    cursor = mongo[DB_ODDS]\
            .find({"betUuid": context.bet_uuid, "yes": True})\
            .sort("timestamp", DESCENDING)\
            .limit(1)
    documents = await cursor.to_list(length=1)
    last_yes = None
    if(len(documents) != 0):
        last_yes = [OddsScheme(odds=float(doc["odds"]), timestamp=int(doc["timestamp"])) for doc in documents][0]

    # get the last no bet
    cursor = mongo[DB_ODDS]\
            .find({"betUuid": context.bet_uuid, "yes": False})\
            .sort("timestamp", DESCENDING)\
            .limit(1)
    documents = await cursor.to_list(length=1)
    last_no = None
    if(len(documents) != 0):
        last_no = [OddsScheme(odds=float(doc["odds"]), timestamp=int(doc["timestamp"])) for doc in documents][0]

    updated_odds = 0.0
    min_adjust = 0.01
    max_adjust = 0.05
    if not last_yes and last_no:
        updated_odds = (last_no.odds / 2) + (random.uniform(min_adjust, max_adjust))
    elif not last_no and last_yes:
        updated_odds = (last_yes.odds + 1 / 2) - (random.uniform(min_adjust, max_adjust))
    elif last_no and last_yes:
        updated_odds = ((last_yes.odds + last_no.odds) / 2) + random.uniform(-max_adjust, max_adjust)
    else: # no bets exist
        updated_odds = odds_collection[0].odds + random.uniform(-max_adjust, max_adjust)
    
    updated_odds = min(max(0.01, updated_odds), 0.99)
    
    # update the odds
    # for implementation look at experiments/adjust_odds
    odds = Odds(
        uuid = str(uuid4()),
        bet_uuid = context.bet_uuid,
        odds = updated_odds,
        timestamp = int(utc_timestamp),
    )
    
    odds_json = MessageToDict(odds)
    odds_json["timestamp"] = int(utc_timestamp)

    try:
        odds_result = await mongo[DB_ODDS].insert_one(odds_json)
        return Success(ok=True, error=None, message=str(odds_result.inserted_id))
    except Exception as ex:
        return Success(ok=False, error=str(ex), message="Failed to update odds") 


@router.post("/create")
async def create_bet(context:BetCreateContext,
                 db = Depends(get_db),
                 mongo = Depends(get_mongo), 
                 api_key:APIKey = Depends(get_api_key)) -> Success:
    user = get_user(api_key, db)
    if not user:
        return Success(ok=False, error="Cannot find the user associated with the API key", message="")

    dt = datetime.datetime.now(timezone.utc) 
    utc_time = dt.replace(tzinfo=timezone.utc) 
    utc_timestamp = utc_time.timestamp() 

    bet = Bet(
        uuid = str(uuid4()),
        creator_uuid = str(user.id),
        title = context.title,
        description = context.description,
        verifier_uuid = "None",
        timestamp = int(utc_timestamp),
        times_viewed = 1,
    )

    # clamp the odds to between 0.01 and 0.99
    odds_input = min(max(0.01, context.odds), 0.99)
    odds = Odds(
        uuid = str(uuid4()),
        bet_uuid = bet.uuid,
        odds = odds_input,
        timestamp = int(utc_timestamp),
    )
    
    bet_json = MessageToDict(bet)
    odds_json = MessageToDict(odds)
    bet_json["timestamp"] = int(utc_timestamp)
    odds_json["timestamp"] = int(utc_timestamp)

    try:
        bet_result = await mongo[DB_BETS].insert_one(bet_json)
        odds_result = await mongo[DB_ODDS].insert_one(odds_json)
        bet_id = bet_result.inserted_id
        return Success(ok=True, error=None, message=str(bet_id))
    except Exception as ex:
        return Success(ok=False, error=str(ex), message="Failed to create bet") 


@router.get("/get_single_bet")
async def get_bet(uuid:str, mongo = Depends(get_mongo), api_key:APIKey = Depends(get_api_key)) -> BetResponse:
    cursor = mongo[DB_BETS].find({"uuid": uuid}).limit(1)
    documents = await cursor.to_list(length=1)
    if len(documents) != 1:
        return BetResponse(success=Success(ok=False, error="Cannot find a bet", message=""), bet=None)

    # Specify the update operation
    update_data = {
        "$set": {
            "timesViewed": int(documents[0]["timesViewed"]) + 1
        }
    }
    
    # Update the document
    result = await mongo[DB_BETS].update_one({"_id": ObjectId(documents[0]["_id"])}, update_data)
    if not result:
        return BetResponse(success=Success(ok=False, error="Could not update the view count of the bet", message=""), bet=None)

    return BetResponse(success = Success(ok=True, error=None, message=""),
                       bet=str(dumps(documents[0])))
    

@router.get("/get/")
async def get_bets(limit:int=10,
                   page:int=1,
                   timestamp:int=0,
                   mongo = Depends(get_mongo),
                   api_key:APIKey = Depends(get_api_key)) -> BetsResponse:
    if page <= 0:
        return BetsResponse(success=
                            Success(
                                ok=False, 
                                error="Page must be at least one", 
                                message=""),
                            bets=None)  

    skip = (page - 1) * limit
    if skip < 0:
        return BetsResponse(success=
                            Success(
                                ok=False, 
                                error="Invalid limit. limit must be at least one", 
                                message=""), 
            bets=None)
    # Query the MongoDB collection with sorting
    cursor = mongo[DB_BETS].find({"timestamp": {"$gt": timestamp}})\
        .sort("timestamp", DESCENDING)\
        .skip(skip)\
        .limit(limit)

    # Convert the cursor result to a list of documents
    documents = await cursor.to_list(length=limit)
    return BetsResponse(success = Success(ok=True, error=None, message=""),
                        bets=str(dumps(documents)))


@router.get("/odds/")
async def get_odds(uid:str,
                   limit:int=1,
                   mongo = Depends(get_mongo),
                   _:APIKey = Depends(get_api_key)) -> OddsResponse:
    if limit <= 0:
        limit = 1

    cursor = mongo[DB_ODDS]\
            .find({"betUuid": uid})\
            .sort("timestamp", DESCENDING)\
            .limit(limit)
    documents = await cursor.to_list(length=limit)
    odds_collection = [OddsScheme(odds=float(doc["odds"]), timestamp=int(doc["timestamp"])) for doc in documents]
    return OddsResponse(success=Success(ok=True, error=None, message=""),
                        odds=odds_collection)