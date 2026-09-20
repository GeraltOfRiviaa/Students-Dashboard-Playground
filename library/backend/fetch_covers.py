"""
Fetches cover URLs from the Open Library Search API for every book in the
`books` collection and writes them back as `coverUrl`.

Requires: pymongo, python-dotenv, requests
Env: DB_CLIENT must be set in .env (a full Mongo connection string that
     includes the database name, e.g. mongodb+srv://.../library?...)
"""

import os
import time

import requests
from dotenv import load_dotenv
from pymongo import MongoClient
from requests.adapters import HTTPAdapter
from pymongo.server_api import ServerApi
from urllib3 import Retry

load_dotenv()

client = MongoClient(os.getenv("DB_CLIENT"), server_api=ServerApi('1'))
db = client['bookstore']
books = db["books"]


HEADERS = {"User-Agent": "library-app/1.0 (student project; contact: sam@example.com)"}
REQUEST_DELAY = 1  # seconds, avoids silent rate-limiting
 
session = requests.Session()
retry = Retry(
    total=5,
    backoff_factor=2,  # 2s, 4s, 8s, 16s, 32s between retries
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"],
)
session.mount("https://", HTTPAdapter(max_retries=retry))
 
 
def find_cover_id(title: str, author_surname: str) -> int | None:
    params = {"title": title, "author": author_surname, "limit": 1}
    # Connection resets from openlibrary.org happen occasionally and aren't
    # covered by urllib3's Retry (it only retries on responses, not on a
    # reset mid-handshake), so wrap the call in its own manual retry too.
    for attempt in range(3):
        try:
            resp = session.get(
                "https://openlibrary.org/search.json",
                params=params,
                headers=HEADERS,
                timeout=15,
            )
            resp.raise_for_status()
            docs = resp.json().get("docs", [])
            return docs[0].get("cover_i") if docs else None
        except requests.exceptions.ConnectionError as e:
            if attempt == 2:
                print(f"  giving up on {title!r} after 3 attempts: {e}")
                return None
            wait = 3 * (attempt + 1)
            print(f"  connection reset, retrying in {wait}s...")
            time.sleep(wait)
 
 
def main():
    updated, skipped = 0, 0
    for book in books.find({}):
        title = book["title"]
        surname = book["author"]["surname"]
 
        cover_id = find_cover_id(title, surname)
        if cover_id is None:
            print(f"no cover found: {title} ({surname})")
            skipped += 1
        else:
            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
            books.update_one({"_id": book["_id"]}, {"$set": {"coverUrl": cover_url}})
            print(f"updated: {title} -> {cover_url}")
            updated += 1
 
        time.sleep(REQUEST_DELAY)
 
    print(f"\nDone. Updated {updated}, skipped {skipped}.")
 
 
if __name__ == "__main__":
    main()
 
