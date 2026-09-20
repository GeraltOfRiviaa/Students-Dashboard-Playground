from fastapi import Depends, FastAPI, HTTPException, Query
from library.backend.models import Book, BookCreate, BookUpdate, User
from library.backend.database import client
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
import re
from typing import Optional, List, Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from os import getenv
import jwt
import httpx
import bcrypt
from library.backend.books import get_book, get_books, get_genres, search_books, update_book, create_book, delete_book
from library.backend.users import exchange_code, login, generate_token, create_user


load_dotenv()

CLIENT_ID = getenv('CLIENT_ID')
CLIENT_SECRET = getenv('CLIENT_SECRET')

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database = client["bookstore"]

books_collection = database["books"]
users_collection = database["users"]

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)







# Routes
#---------------------------------------------------------------------
@app.post("/token")
async def token(form_data: OAuth2PasswordRequestForm = Depends()):
    return await generate_token(form_data)

@app.post("/users", response_model=User)
async def register(user: User):
    return await create_user(user)

@app.get("/books")
def list_books():
    return get_books()

@app.get("/books/genres")
def list_genres():
    return get_genres()

@app.get("/books/search")
def search(query: Optional[str] = None, genres: Optional[List[str]] = Query(None)):
    return search_books(query, genres)

@app.get("/books/{book_id}")
def book_detail(book_id: str):
    return get_book(book_id)

@app.patch("/books/{book_id}", response_model=Book, status_code=201)
def patch_book(book_id: str, updated_book: BookUpdate):
    return update_book(book_id, updated_book)

@app.post("/books", response_model=Book, status_code=201)
def add_book(book: BookCreate):
    return create_book(book)

@app.delete("/books/{book_id}")
def remove_book(book_id: str):
    return delete_book(book_id)

@app.get("/auth/login")
async def auth_login():
    return await login()

@app.get("/auth/callback")
async def auth_callback(code: str):
    return await exchange_code(code)