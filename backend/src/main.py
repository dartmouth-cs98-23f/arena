import uvicorn
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import os


from backend.src.routers import index
from backend.src.routers import bets
from backend.src.routers import users

__version__ = "0.0.1"

description = """
Backend for arena
"""

app = FastAPI(
    title = "arena",
    description = description,
    version = __version__,
    contact = {
        "name": "Ian Kim",
        "email": "ian@iankim.dev"
    })

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, for development only, adjust for production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(index.router,
                    prefix="",
                    tags=["index"])
app.include_router(bets.router,
                   prefix="/bets",
                   tags=["bets"])
app.include_router(users.router,
                   prefix="/user",
                   tags=["user"])

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")