from typing import Optional

from fastapi.security.api_key import APIKeyHeader
from fastapi import Security, HTTPException, Depends
from starlette.status import HTTP_403_FORBIDDEN

from sqlalchemy.orm import Session
from backend.src.models.database import SessionLocal, engine, get_db
from backend.src.models.database import Key, KeyUse

from datetime import datetime

api_key_header = APIKeyHeader(name="access_token", auto_error=False)

async def get_api_key(api_key_header:str = Security(api_key_header),
                      db:Session = Depends(get_db)) -> Optional[str]:
    print("API_KEY HEADER: ", api_key_header)
    keyobj = db.query(Key).filter(Key.key == api_key_header).first()
    print(keyobj)
    if keyobj is not None:
        useRecord = KeyUse(date = datetime.now())
        keyobj.utilization.append(useRecord)
        print(useRecord)
        db.add(keyobj)
        db.commit()
        return api_key_header

    raise HTTPException(
        status_code = HTTP_403_FORBIDDEN,
        detail = "Could not validate API Key")
