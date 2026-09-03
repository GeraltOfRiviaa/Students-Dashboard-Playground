# Library

A small full-stack book-library app: a FastAPI + MongoDB backend serving book
data, and a React + Vite frontend for browsing it. This is one of several
learning "playgrounds" inside the [`Students-Dashboard-Playground`](../)
monorepo, alongside `movies`, `mongodb`, `react-app`, and
`javascriptmastery-js-course`.

## What it does

- Stores books (title, author, page count, genres, description, release
  date, cover image) in a MongoDB `bookstore.books` collection.
- Exposes a REST API to list, fetch, search, create, update, and delete
  books, plus an endpoint to list all distinct genres.
- Renders the book catalog as a card grid in the browser, with a
  (partially wired) genre filter and search bar.
- Includes a one-off script that backfills cover images for existing books
  by querying the Open Library API.

## Tech stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/)
- [PyMongo](https://pymongo.readthedocs.io/) for MongoDB access
- [Pydantic](https://docs.pydantic.dev/) models for request/response validation

**Frontend**
- React 19 + Vite
- Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/) components
- `react-router-dom` (HashRouter)
- `react-aria-components` and Hugeicons for UI primitives/icons

## Project structure

```
library/
├── main.py              # FastAPI app: /books CRUD + search + genres endpoints
├── models.py             # Pydantic models: Author, Book, BookCreate, BookUpdate
├── database.py           # MongoDB client setup (reads connection string from file)
├── fetch_covers.py        # Standalone script: backfills coverUrl via Open Library API
├── requirements.txt       # Backend Python dependencies
├── package.json           # Frontend dependencies/scripts
├── vite.config.js
└── src/
    ├── App.jsx             # Routes: "/" (Home) and "/detail" (stub)
    ├── Layout.jsx           # Shared navbar + outlet
    ├── api.jsx              # (incomplete) API helper module
    ├── pages/
    │   ├── home.jsx          # Fetches /books and /books/genres, renders card grid
    │   └── detail.jsx        # Placeholder page, not yet implemented
    └── components/
        ├── booksCards.jsx      # Book card (cover, title, author, genres, pages, year)
        ├── comboboxMultiple.jsx # Multi-select genre combobox
        ├── navbar.jsx           # Logo + search input
        └── ui/, icons/           # shadcn/ui primitives and Hugeicons wrappers
```

## Setup

### Backend

```bash
cd library
pip install -r requirements.txt
```

Create a `mongo_connection_string.txt` file in the `library/` folder
containing your MongoDB connection string (this file is gitignored and not
included in the repo — the app will not start without it). Then run:

```bash
uvicorn main:app --reload
```

The API listens on `http://127.0.0.1:8000`. CORS is currently only
configured to allow requests from `http://localhost:5173` (the Vite dev
server), so this setup is dev-only as it stands.

### Frontend

```bash
cd library
npm install
npm run dev
```

Opens at `http://localhost:5173` and expects the backend to be running at
`http://127.0.0.1:8000` (the endpoint is hardcoded in `src/pages/home.jsx`).

### Optional: backfill cover images

```bash
python fetch_covers.py
```

Queries Open Library for each book's cover and writes a `coverUrl` field
onto the corresponding MongoDB document.

## API endpoints

| Method | Path              | Description                          |
|--------|-------------------|---------------------------------------|
| GET    | `/books`           | List all books                        |
| GET    | `/books/genres`     | List distinct genres                  |
| GET    | `/books/search?query=` | Full-text search by title/author  |
| GET    | `/books/{id}`       | Get a single book                     |
| POST   | `/books`            | Create a book                         |
| PATCH  | `/books/{id}`       | Update a book                         |
| DELETE | `/books/{id}`       | Delete a book                         |

## Current state

This is a work in progress, not a finished app:

- **Detail page is a stub.** `/detail` renders only a heading and isn't
  linked from anywhere yet — no per-book detail view exists.
- **Search bar is UI-only.** The navbar has a search input, but it isn't
  wired up to the `/books/search` endpoint yet.
- **Genre filter isn't applied.** The multi-select genre combobox on the
  home page tracks selected genres in state, but the book list isn't
  actually filtered by that selection yet.
- **`api.jsx` is incomplete.** Its `getEndpoint` helper isn't correctly
  exported, so `home.jsx` currently hardcodes the API URL directly instead
  of importing it.
- **No deployment/config story yet.** The Mongo connection string is read
  from a local untracked file, and CORS is locked to the Vite dev server
  origin — there's no environment-based config for other environments.
- **No automated tests** currently exist for either the API or the
  frontend.

In short: the data layer and basic CRUD API are functional, and the home
page can list and display books from MongoDB, but browsing (search,
filtering, detail view) is only partially built out.
