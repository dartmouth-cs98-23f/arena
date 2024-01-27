import uvicorn
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi_profiler import PyInstrumentProfilerMiddleware

import os


from backend.src.routers import index
from backend.src.routers import bets
from backend.src.routers import users
from backend.src.routers import verifiers
from backend.src.models import database

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

""" for DEBUG purposes only
app.add_middleware(
    PyInstrumentProfilerMiddleware,
    server_app=app,
    profiler_output_type="html",
    is_print_each_request=False,  # Set to True to show request profile on
                                  # stdout on each request
    open_in_browser=False,        # Set to true to open your web-browser automatically
                                  # when the server shuts down
    html_file_name="example_profile.html"  # Filename for output
)
"""

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY"),
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
app.include_router(verifiers.router,
                    prefix="/verifiers",
                    tags=["verifiers"])

@app.on_event("startup")
async def startup():
    app.state.db = database.get_db()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8888, log_level="info")
