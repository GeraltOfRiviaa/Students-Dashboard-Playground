import bcrypt
from bson import ObjectId
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import httpx
import jwt
from dotenv import load_dotenv
from os import getenv

from models import UserCreate
from database import client

database = client["bookstore"]
users_collection = database["users"]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

JWT_SECRET = 'secret'
load_dotenv()

CLIENT_ID = getenv('CLIENT_ID')
CLIENT_SECRET = getenv('CLIENT_SECRET')

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def auth_user(nickname: str, password: str):
    user = users_collection.find_one({"nickname" : nickname})
    
    if not user:
        return False
    if not verify_password(password=password, hashed=user["passwordHash"]):
        return False
    
    return user

        
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms="HS256")
        user = users_collection.find_one({"_id" : ObjectId(payload.get("sub"))})  
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password: ")
        
        user["_id"] = str(user["_id"])
        return user
    except Exception as e:
            raise HTTPException(status_code=401, detail="Could not get current user: " + str(e))


async def exchange_code(code: str):
    try:
        async with httpx.AsyncClient() as client:
            # 1. exchange code for tokens
            token_resp = await client.post("https://oauth2.googleapis.com/token", data={
                "code": code,
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "redirect_uri": "http://localhost:8000/auth/callback",
                "grant_type": "authorization_code",
            })
            token_data = token_resp.json()

            if "access_token" not in token_data:
                raise HTTPException(status_code=401, detail=f"Google token exchange failed: {token_data}")

            # 2. use access_token to get profile info — Google verifies it, not you
            userinfo_resp = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token_data['access_token']}"}
            )
            google_user = userinfo_resp.json()

        # 3. issue YOUR OWN jwt containing the google profile info
        payload = {
            "sub": google_user["sub"],       # google's unique user id
            "email": google_user.get("email"),
            "name": google_user.get("name"),
        }
        app_token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        return {"access_token": app_token, "token_type": "bearer"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Could not exchange code with google: " + str(e))
    
async def login():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={CLIENT_ID}"
        "&redirect_uri=http://localhost:8000/auth/callback"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
    )
    return google_auth_url 

async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    
    try:
        user = auth_user(form_data.username, form_data.password)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password: ")
        
        payload = {
            "sub": str(user["_id"]),
            "nickname": user["nickname"],
        }
        
        token = jwt.encode(payload, JWT_SECRET)
        
        return {'access_token': token, 'token_type' : 'bearer'}
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Could not generate a token:" + str(e))
    
async def create_user(user: UserCreate):
    """Create a new user."""
    try:
        user_dict = user.model_dump(by_alias=True, exclude_none=True)
        user_dict["passwordHash"] = hash_password(user_dict["passwordHash"])
        result = users_collection.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)
        return user_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not create user: " + str(e))
    

