from pydantic import BaseModel
from typing import Optional

class Success(BaseModel):
    ok: bool
    error: Optional[str]
    message: str