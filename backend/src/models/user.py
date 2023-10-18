from sqlalchemy import Column, String
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.declarative import declarative_base

BaseModel = declarative_base()

class User(BaseModel):
    __tablename__ = 'user'
    __table_args__ = {'useexisting': True}

    id = Column(
        postgresql.UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )

    first_name = Column(String(256))
    last_name = Column(String(256))
    email = Column(String(256))
    google_id = Column(String(1024))
    api_token = Column(String(1024))
