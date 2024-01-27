from typing import Optional

from fastapi import Request
from fastapi.security.api_key import APIKeyHeader
from fastapi import Security, HTTPException, Depends
from starlette.status import HTTP_403_FORBIDDEN

from sqlalchemy.orm import Session
from backend.src.models.database import SessionLocal, engine, get_db
from backend.src.models.database import Key, KeyUse

from datetime import datetime

api_key_header = APIKeyHeader(name="access_token", auto_error=False)

async def get_api_key_from_state(request:Request) -> Optional[str]:
    if "access_token" not in request.headers:
        raise HTTPException(
            status_code = HTTP_403_FORBIDDEN,
            detail = "Could not find \"access_token\" in header",
        )

    api_key_header = request.headers["access_token"]
    # we get database from the app state which is in the request
    print("API_KEY:", api_key_header)
    keyobj = request.app.state.db.query(Key).filter(Key.key == api_key_header).first()
    if(keyobj is not None):
        return str(keyobj.user_id)

    raise HTTPException(
        status_code = HTTP_403_FORBIDDEN,
        detail = "Could not validate API Key")

async def get_api_key(api_key_header:str = Security(api_key_header),
                      db:Session = Depends(get_db)) -> Optional[str]:
    keyobj = db.query(Key).filter(Key.key == api_key_header).first()

    if keyobj is not None:
        # delete API use records for performance
        #useRecord = KeyUse(date = datetime.now())
        #keyobj.utilization.append(useRecord)
        #db.add(keyobj)
        #db.commit()
        return api_key_header

    raise HTTPException(
        status_code = HTTP_403_FORBIDDEN,
        detail = "Could not validate API Key")
