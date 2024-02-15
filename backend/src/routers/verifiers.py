import random
from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, Request
from bson import ObjectId

from backend.src.models.database import get_mongo, get_db, get_user, DB_BETS, DB_ODDS, DB_WAGERS, User 
from backend.src.auth import get_api_key_from_state

from backend.src.schemas.bets import BetsResponse
from backend.src.schemas.index import Success
from backend.src.schemas.verifiers import AcceptInvitationsContext, ResolveBetContext

from bson.json_util import dumps

router = APIRouter()

"""
- list of all verifier invites for a given userid
- list of all current verifications for a given userid
- accept/reject an invite
- close a bet in yes/no
"""

@router.get("/invites")
async def get_invites(request:Request,
                      mongo=Depends(get_mongo)) -> BetsResponse:
    user_uuid = await get_api_key_from_state(request)
    cursor = mongo[DB_BETS].find({
        "verifierUuid": user_uuid,
        "verifier_accepted": False,
        "resolved": False,
    }).limit(10000)
    documents = await cursor.to_list(length=10000)

    return BetsResponse(success = Success(ok=True, error=None, message=""), bets=str(dumps(documents)))    


@router.get("/verifications")
async def get_verifications(request: Request,
                            mongo=Depends(get_mongo)) -> BetsResponse:
    user_uuid = await get_api_key_from_state(request)
    cursor = mongo[DB_BETS].find({
        "verifierUuid": user_uuid,
        "verifier_accepted": True,
        "resolved": False,
    }).limit(10000)
    documents = await cursor.to_list(length=10000)
    
    return BetsResponse(success=Success(ok=True, error=None, message=""), bets=str(dumps(documents)))


@router.post("/accept")
async def accept_invite(request:Request,
                        accept_invitation_context: AcceptInvitationsContext = Depends(),
                        mongo=Depends(get_mongo)) -> Success:
    user_uuid = await get_api_key_from_state(request)
    bet_uuid = accept_invitation_context.bet_uuid
    accept = accept_invitation_context.accept
    cursor = mongo[DB_BETS].find({
        "uuid": bet_uuid, 
        "verifierUuid": user_uuid,
        "verifier_accepted": False}).limit(1)
    documents = await cursor.to_list(length=1)

    if len(documents) != 1:
        return Success(ok=False, error="Cannot find the requested bet", message="")

    document = documents[0]
    if accept:
        update_data = {
            "$set": {
                "verifier_accepted": True,
            }
        }
        
    else:
        update_data = {
            "$set": {
                "verifier_uuid": "",
            }
        }

    result = await mongo[DB_BETS].update_one({"_id": ObjectId(document["_id"])}, update_data)
    if result.modified_count == 0:
        return Success(ok=False, error="No changes made - the bet might already have been accepted or does not exist", message="")
    
    return Success(ok=True, error=None, message="Accepted the verifiers request")


@router.post("/resolve")
async def resolve_bet(request:Request,
                      bet_uuid:str,
                      resolve:bool,
                      mongo=Depends(get_mongo)) -> Success:
    user_uuid = await get_api_key_from_state(request)
    cursor = mongo[DB_BETS].find({
        "uuid": bet_uuid, 
        "verifierUuid": user_uuid,
        "verifier_accepted": True
    }).limit(1)
    documents = await cursor.to_list(length=1)
    
    if len(documents) != 1:
        return Success(ok=False, error="Cannot resolve the bet because the bet could not be found", message="")
    
    document = documents[0]
    update_data = {
        "$set": {
            "resolved": True,
            "result": resolve,
        }
    }

    result = await mongo[DB_BETS].update_one({"_id": ObjectId(document["_id"])}, update_data)
    if not result:
        return Success(ok=False, error="Cannot resolve a bet because the state could not be modified", message="")

    return Success(ok=True, error=None, message="Bet successfully resolved")
