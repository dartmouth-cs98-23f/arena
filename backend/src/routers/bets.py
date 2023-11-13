import random
from uuid import uuid4, UUID
from fastapi import APIRouter, Depends
from fastapi.security.api_key import APIKey
from pymongo import DESCENDING
from bson import ObjectId

from backend.src.models.database import get_mongo, get_db,  get_user, DB_BETS, DB_ODDS, DB_WAGERS, User
from backend.src.schemas.bets import BetCreateContext, BetsResponse, BetsGetContext, OddsResponse, OddsScheme, WagerCreateContext, BetSettlement, BetResponse, Holdings
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
        resolved = False,
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
    bet_json["resolved"] = False
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

@router.get("/holdings")
async def get_holdings(betUuid:str, db = Depends(get_db), mongo = Depends(get_mongo), api_key:APIKey = Depends(get_api_key)) -> Holdings:
    user = get_user(api_key, db)
    user_uuid_call = str(user.id)
    # Retrieve all wagers for the given bet_uuid and given user
    wagers_cursor = mongo[DB_WAGERS].find({"betUuid": betUuid, "userUuid": user_uuid_call})
    wagers = await wagers_cursor.to_list(length=100000)
    owned_yes = 0
    owned_no = 0
    for wager in wagers:
        if wager['yes'] == True:
            owned_yes += wager['tokens']
        else:
            owned_no += wager['tokens']
    return Holdings(success = Success(ok=True, error=None, message=""), yes = owned_yes, no =owned_no)


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
    cursor = mongo[DB_BETS].find({"timestamp": {"$gt": timestamp}, "resolved": False})\
        .sort("timestamp", DESCENDING)\
        .skip(skip)\
        .limit(limit)

    # Convert the cursor result to a list of documents
    documents = await cursor.to_list(length=limit)
    return BetsResponse(success = Success(ok=True, error=None, message=""),
                        bets=str(dumps(documents)))

@router.get("/positions/")
async def get_positions(
        limit: int = 10,
        page: int = 1,
        timestamp: int = 0,
        db=Depends(get_db),
        mongo=Depends(get_mongo),
        api_key: APIKey = Depends(get_api_key)) -> BetsResponse:
    user = get_user(api_key, db)
    user_uuid_call = str(user.id)

    if page <= 0:
        return BetsResponse(success=Success(ok=False, error="Page must be at least one", message=""), bets=None)

    skip = (page - 1) * limit
    if skip < 0:
        return BetsResponse(success=Success(ok=False, error="Invalid limit. limit must be at least one", message=""), bets=None)

    # Retrieve all wagers for the given user_uuid
    wagers_cursor = mongo[DB_WAGERS].find({"userUuid": user_uuid_call})
    wagers = await wagers_cursor.to_list(length=100000)

    # Extract unique betUuids from wagers
    unique_bet_uuids = {wager['betUuid'] for wager in wagers}

    # Retrieve bets from DB_BETS matching the unique betUuids
    bets_cursor = mongo[DB_BETS].find({"uuid": {"$in": list(unique_bet_uuids)}, "resolved": False})
    bets = await bets_cursor.to_list(length=limit)

    # Convert the cursor result to a list of documents
    return BetsResponse(success=Success(ok=True, error=None, message=""), bets=str(dumps(bets)))


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

@router.post("/settle")
async def settle_bet(settlement: BetSettlement, 
                    db=Depends(get_db),
                    mongo=Depends(get_mongo),
                    api_key:APIKey = Depends(get_api_key)) -> Success:

    bet_query = {"uuid": settlement.bet_uuid}
    bets_cursor = mongo[DB_BETS].find(bet_query)
    bets = await bets_cursor.to_list(length=1)
    if len(bets) != 1:
        return Success(ok=False, error="No such bets found, cannot resolve", message="")
    
    # Retrieve all wagers for the given bet_uuid
    wagers_cursor = mongo[DB_WAGERS].find({"betUuid": settlement.bet_uuid})
    wagers = await wagers_cursor.to_list(length=100000)

    # Iterate through each wager to calculate and update user balance
    for wager in wagers:
        try:
            print("USER UUID")
            print(UUID(wager['userUuid']))
            user = db.query(User).filter(User.id == UUID(wager['userUuid'])).first()
        except Exception as ex:
            return Success(ok=False, error=str(ex), message="User not found") 

        # Calculate payout based on the odds and whether the user bet Yes or No
        odds = wager['odds']
        if (wager['yes'] and settlement.outcome):
            payout = wager['tokens'] / odds
        elif (not wager['yes'] and not settlement.outcome):
            payout = wager['tokens'] / (1- odds)
        else:
            payout = 0

        # Update the user balance
        user.balance += payout
        db.commit()

    # mark a bet as resolved
    mongo[DB_BETS].replace_one(bet_query, {"resolved": True})
    return Success(ok=True, error=None, message="All bets settled and balances updated.")
