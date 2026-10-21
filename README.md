# APUR League

Web app to run a tennis league: players, categories, weekly fixtures across clubs and courts,
results and standings.

## Features

- **Players and categories.** A player can play in more than one category.
- **Fixtures** organised by match week and match day, with the time, club and court of each
  match. Singles and doubles.
- **Results and standings** per category: points, matches played and won, set and game
  difference.
- **PDF exports.**
- **Login with roles** (admin and user).

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript |
| Data | PostgreSQL + Prisma |
| Auth | NextAuth (credentials, bcrypt) |
| Forms | React Hook Form |
| PDF | @react-pdf/renderer |
| UI | Tailwind CSS 4 |

## Running it

1. Create a `.env` file with `DATABASE_URL`, `DIRECT_URL` and the NextAuth variables.
2. Install dependencies and apply the schema:

```bash
npm install
npx prisma migrate dev
npm run dev
```

The app runs at http://localhost:3000.
