from pydantic import BaseModel, EmailStr
from bson import ObjectId

class User(BaseModel):
    _id: ObjectId
    nickname: str
    email: EmailStr
    passwordHash: str