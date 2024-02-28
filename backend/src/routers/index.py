import json
from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.responses import RedirectResponse
from starlette.config import Config
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuth
from backend.src.schemas.index import Success
from backend.src.models.database import Base, SessionLocal, engine, Key, User
import secrets
import datetime
import os

router = APIRouter()

oauth = OAuth()

CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
oauth.register(
    name='google',
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("CLIENT_SECRET"),
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    }
)

@router.get("/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url='/')


@router.get("/")
async def index() -> Success:
    return Success(ok=True,
                   message = "Hello world",
                   error = None)

@router.get("/apple-app-site-association")
async def apple_app_site_association():
    site_association_string = """
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "7379ZHK5D8.markets98.arena.arena",
        "paths": ["*"]
      }
    ]
  }
}
    """
    return JSONResponse(content=json.loads(site_association_string))

@router.route('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth')  # This creates the url for our /auth endpoint
    print("redirect URI from login: ", redirect_uri)
    return await oauth.google.authorize_redirect(request, redirect_uri, prompt='select_account', login_hint='user@dartmouth.edu')

@router.get("/auth")
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token['userinfo']
    request.session['user'] = userinfo

    # Check if the email ends with @dartmouth.edu
    if not userinfo['email'].endswith("@dartmouth.edu"):
        # If it doesn't, return an error response.
        return Success(ok=False, error = "Must be Dartmouth email", message = "")

    # Connect to the database
    db = SessionLocal()

    # Check if user already exists
    user = db.query(User).filter(User.email == userinfo['email']).first()
    if not user:
        # If user does not exist, create a new user and API key
        api_key = secrets.token_urlsafe(24)
        user = User(
            first_name=userinfo['given_name'],
            last_name=userinfo['family_name'],
            email=userinfo['email'],
            google_id=userinfo['sub'],  # Assuming 'sub' is the Google user ID
            api_token=api_key,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        key = Key(
                name="Key",
                key=api_key,
                created=datetime.datetime.now(),
                user_id = user.id)

        db.add(key)
        db.commit()
    else:
        # If user exists, retrieve the API key
        api_key = user.api_token
    
    #response = RedirectResponse(url=f"exp://?api_key={api_key}")
    response = RedirectResponse(url=f"markets98.arena.arena://?api_key={api_key}")
    return response
