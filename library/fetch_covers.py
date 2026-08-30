"""
Fetches book cover URLs from the Open Library API and updates each
book document in MongoDB with a new `coverUrl` field.

Run this locally (same folder as your database.py, or adjust the import).
Requires: pip install requests
"""

import re
import time
import requests
from database import client

database = client["bookstore"]
books_collection = database["books"]

HEADERS = {"User-Agent": "StudentBookstoreApp/1.0 (contact: your_email@example.com)"}


def clean_surname(surname: str) -> str:
    """Strip Czech feminine surname suffix for searching international databases."""
    return re.sub(r"ová$", "", surname)


def find_cover_url(title: str, author_surname: str) -> str | None:
    search_surname = clean_surname(author_surname)

    resp = requests.get(
        "https://openlibrary.org/search.json",
        params={"q": f"{title} {search_surname}", "limit": 1},
        headers=HEADERS,
        timeout=10,
    )
    print(f"  [title+author] status={resp.status_code}")
    resp.raise_for_status()
    docs = resp.json().get("docs", [])

    if not docs:
        resp = requests.get(
            "https://openlibrary.org/search.json",
            params={"q": search_surname, "limit": 1},
            headers=HEADERS,
            timeout=10,
        )
        print(f"  [author only] status={resp.status_code}")
        resp.raise_for_status()
        docs = resp.json().get("docs", [])

    if not docs:
        return None

    cover_id = docs[0].get("cover_i")
    return f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg" if cover_id else None


def main():
    books = list(books_collection.find())
    updated, missing = 0, []

    for book in books:
        title = book.get("title", "")
        surname = book.get("author", {}).get("surname", "")

        try:
            cover_url = find_cover_url(title, surname)
        except Exception as e:
            print(f"Error fetching '{title}': {e}")
            cover_url = None

        if cover_url:
            books_collection.update_one(
                {"_id": book["_id"]},
                {"$set": {"coverUrl": cover_url}}
            )
            print(f"✓ {title} -> {cover_url}")
            updated += 1
        else:
            print(f"✗ No cover found for: {title}")
            missing.append(title)

        time.sleep(1.0)  # be polite to the API, avoid rate limiting

    print(f"\nDone. Updated {updated}/{len(books)} books.")
    if missing:
        print("No cover found for:")
        for t in missing:
            print(f"  - {t}")


if __name__ == "__main__":
    main()