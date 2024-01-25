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

def get_api_key_from_state(request:Request) -> Optional[str]:
    api_key_header = Security(APIKeyHeader(name="access_token", auto_error=False))
    # we get database from the app state which is in the request
    for db in request.app.state.db:
        print(api_key_header)
        keyobj = db.query(Key).filter(Key.key == str(api_key_header)).first()
        print(keyobj)
        print()
        if(keyobj is not None):
            return api_key_header

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
