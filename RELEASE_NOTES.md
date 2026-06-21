# URL Shortener Backend v1.0.0

**Release date:** June 21, 2026  
**Branch:** `master`  
**Commit:** `19c40fd` — *Created Backend service: shorten and redirect services*

## Overview

First release of the URL Shortener backend: a Node.js + Express API that shortens long URLs and redirects users to the original destination. The app uses PostgreSQL for persistence and a layered architecture (routers → controllers → services).

---

## What's New

### Core API

- **`POST /api/shorten`** — Accepts a long URL and optional expiry, returns a shortened code and metadata.
- **`GET /api/redirect/:shortCode`** — Looks up a short code and redirects (301) to the original URL.
- **`GET /health`** — Health check endpoint for uptime monitoring.

### URL Shortening

- Short codes generated via **MD5 hash** + **custom Base62 encoding** (`utility/base62Encoding.js`).
- Request validation with **Zod** (`url`, optional `expireAt`).

### Architecture

- **Routers:** `urlShorten`, `redirectShortUrl`
- **Controllers:** request handling and HTTP responses
- **Services:** shortening and redirect lookup logic
- **Config:** PostgreSQL connection pool (`config/db.config.js`)

### Database

- PostgreSQL schema `url_shortner` with `urls` table.
- Migrations via **node-pg-migrate**:
  - Create `urls` table (`original_url`, `short_url`, `created_at`, `expire_at`)
  - Extend `short_url` to `varchar(15)` with unique constraint
  - Make `expire_at` optional

### Server & Middleware

- **Express 5** with CORS and JSON body parsing
- **Rate limiting:** 100 requests per IP per 15 minutes
- **Nodemon** for local development (`npm start`)
- Environment-based config via **dotenv**

---

## Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Runtime     | Node.js           |
| Framework   | Express 5         |
| Database    | PostgreSQL (`pg`) |
| Migrations  | node-pg-migrate   |
| Validation  | Zod               |
| Dev tools   | nodemon           |

---

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment (.env)
# DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, BASE62_ENCODING

# Run migrations
npm run migrate

# Start the server
npm start
```

**Example — shorten a URL:**

```http
POST http://localhost:3000/api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/path",
  "expireAt": "2026-12-31T00:00:00.000Z"
}
```

**Example — redirect:**

```http
GET http://localhost:3000/api/redirect/{shortCode}
```

---

## Known Limitations (v1.0.0)

- Shortening service returns generated codes but **DB insert logic is not fully wired** yet (persistence helpers exist but are commented out).
- Redirect lookup does **not yet filter expired URLs**.
- Automated tests are not included (`npm test` is a placeholder).

---

## Files Added (16)

`.gitignore`, `README.md`, `index.js`, `package.json`, `config/db.config.js`, controllers, routers, services, utility, and 3 migration files.

---

## Publish to GitHub

```powershell
gh release create v1.0.0 --title "URL Shortener Backend v1.0.0" --notes-file RELEASE_NOTES.md
```
