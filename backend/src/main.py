import uvicorn
from fastapi import Depends, FastAPI

from backend.src.routers import index

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

app.include_router(index.router,
                    prefix="",
                    tags=["index"])

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")