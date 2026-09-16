from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import User
import bcrypt
from database import client
from bson import ObjectId

database = client["oauth2_fastapi"]

users_collection = database["users"]

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

async def auth_user(nickname: str, password: str):
    user =  await users_collection.find_one({"nickname" : nickname})
    return user
    

@app.post("/token")
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    return

@app.post("/users", response_model=User)
async def create_user(user: User):
    """Create a new user."""
    try:
        user_dict = user.model_dump()
        user_dict["passwordHash"] = hash_password(user_dict["passwordHash"])
        user_dict["_id"] = str(user_dict["_id"])
        users_collection.insert_one(user_dict)
        return user_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not create user: " + str(e))
    
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

print(auth_user("admin", "b"))