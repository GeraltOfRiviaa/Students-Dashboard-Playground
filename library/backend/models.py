from pydantic import BaseModel, Field
from datetime import datetime

class Author(BaseModel):
    name: str
    surname: str
    nationality: str

class BookBase(BaseModel):
    title: str
    author: Author
    pages: int
    genres: list[str]
    description: str
    coverUrl: str

class BookCreate(BookBase):
    release_date: datetime = Field(alias="releaseDate")

class BookUpdate(BaseModel):
    title: str | None = None
    pages: int | None = None
    author: Author | None = None
    description: str | None = None

class Book(BookBase):
    id: str | None = Field(default=None, alias="_id")
    release_date: datetime = Field(alias="releaseDate")

class Config:
    populate_by_name = True

class UserBase(BaseModel):
    nickname: str

class UserCreate(UserBase):
    passwordHash: str  # plain password in from the client, hashed before insert

class User(UserBase):
    id: str = Field(alias="_id")