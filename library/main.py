from fastapi import FastAPI, HTTPException
from models import Book, BookCreate, BookUpdate
from database import client
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

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

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
    

@app.get("/books")
def get_books() -> list:
    """get all books and everything about them"""
    try:
        books = list(books_collection.find())
        for book in books:
            book["_id"] = str(book["_id"])
        return books
    except Exception as e:
        raise HTTPException(status_code=404, detail="Could not fetch books: " + str(e))

@app.get("/books/genres")
def get_genres():
    """Get all unique genres from the books collection"""
    try:
        genres = books_collection.distinct("genres")
        return genres
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not fetch genres: " + str(e))

@app.get("/books/search")
def search_books(query: str):
    """get a book by searching for its title or author"""
    try:
        books = list(books_collection.find(
            {"$text": {"$search": query}},
            {"relevance": {"$meta": "textScore"}}
        ).sort([("relevance", {"$meta": "textScore"})]))
        for book in books:
            book["_id"] = str(book["_id"])
        return books
    except Exception as e:
        raise HTTPException(status_code=404, detail="Could not search books: " + str(e))

@app.get("/books/{book_id}")
def get_book(book_id: str) -> Book:
    """get a book by its ID"""
    try:
        if ObjectId.is_valid(book_id): 
            book = books_collection.find_one({"_id": ObjectId(book_id)})
            if book:
                book["_id"] = str(book["_id"])
                return book
            raise HTTPException(status_code=404, detail="Book not found")
        raise HTTPException(status_code=404, detail="Book not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not fetch book: " + str(e))
    
@app.patch("/books/{book_id}", response_model=Book, status_code=201)
def update_book(book_id: str, updated_book: BookUpdate):
    """Update an existing book in the database"""
    try:
        if ObjectId.is_valid(book_id):
            book_dict = updated_book.model_dump(by_alias=True, exclude_unset=True)
            books_collection.update_one({"_id": ObjectId(book_id)}, {"$set": book_dict})
            
            book = books_collection.find_one({"_id": ObjectId(book_id)})
            if book:
                book["_id"] = str(book["_id"])
                return book
            raise HTTPException(status_code=404, detail="Book not found")
            
        raise HTTPException(status_code=404, detail="Book not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not update book: " + str(e))
    


@app.post("/books", response_model=Book, status_code=201)
def create_book(book: BookCreate):
    """Create a new book in the database"""
    try:
        book_dict = book.model_dump(by_alias=True)
        result = books_collection.insert_one(book_dict)
        book_dict["_id"] = str(result.inserted_id)
        return book_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not create book: " + str(e))


@app.delete("/books/{book_id}")
def delete_book(book_id: str):
    """Delete a book from a database by its ID"""
    if ObjectId.is_valid(book_id):
        try:
            result = books_collection.delete_one({"_id": ObjectId(book_id)})
            
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Book not found")
            
            return {"deleted" : result.deleted_count}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail="Could not delete a book: " + str(e))
    else:
        raise HTTPException(status_code=400, detail="Wrong book id")

