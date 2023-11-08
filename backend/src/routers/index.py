from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse
from starlette.responses import RedirectResponse
from starlette.config import Config
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuth
from backend.src.schemas.index import Success

router = APIRouter()

oauth = OAuth()

CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
oauth.register(
    name='google',
    client_id="988417806604-ggnkhrhere0el8b4r3ehko3ncmt8181r.apps.googleusercontent.com",
    client_secret="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",
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    }
)

@router.get("/auth")
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    request.session['user'] = token['userinfo']
    # You can now create a user session or a JWT token
    # and redirect the user to the internal page with the token
    return RedirectResponse(url='/')

@router.get("/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url='/')
async def index() -> Success:
    return Success(ok=True,
                   message = "Hello world",
                   error = None)
