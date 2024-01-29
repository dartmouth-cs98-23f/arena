from pydantic import BaseModel

from backend.src.schemas.index import Success


class AcceptInvitationsContext(BaseModel):
    bet_uuid: str
    accept: bool


class ResolveBetContext(BaseModel):
    bet_uuid: str
    resolve: bool