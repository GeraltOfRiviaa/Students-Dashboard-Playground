from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    id: str |  None = Field(default=None, alias="_id")
    nickname: str
    email: EmailStr
    passwordHash: str
    
    class Config:
        populate_by_name = True