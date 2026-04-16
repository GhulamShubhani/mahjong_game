# Hand Betting Game (Mahjong Tiles)

A full-stack technical assessment project with:

- `app`: React + TypeScript + Redux frontend
- `server`: Node.js + Express + MongoDB backend

The game deals Mahjong-style tiles in 3-tile hands. You bet whether the next hand total will be higher or lower. Non-number tile values dynamically evolve during gameplay.

## Assessment Coverage

This implementation includes the required features from the provided "Hand Betting Game" brief:

- Landing page with **New Game** and **Top 5 Leaderboard**
- Mahjong tile-based hand game logic
- Dynamic tile scaling for non-number tiles (winds/dragons)
- Draw/discard pile counters and reshuffle behavior
- Game over conditions
- History display for previous hands
- End-of-game summary with leaderboard submission

## Tech Stack

### Frontend (`app`)

- React 19
- TypeScript
- Redux Toolkit + React Redux
- Vite
- Tailwind CSS v4
- Axios
- Lucide icons + shadcn-style UI button utility

### Backend (`server`)

- Node.js + TypeScript
- Express 5
- Mongoose
- Joi validation
- CORS + dotenv

## Project Structure

```text
new_mohjong_game/
  app/                       # Frontend (Vite + React)
    src/
      api/                   # API client layer
      app/                   # Redux store + hooks
      features/              # Redux slices (game, leaderboard)
      screens/               # Landing, GameTable, Summary
      lib/                   # UI/game helper functions
  server/                    # Backend (Express + MongoDB)
    src/
      config/                # DB connection
      controllers/           # HTTP controllers
      services/              # Business logic
      models/                # Mongoose models
      routes/                # Route registration
      validators/            # Joi schemas
      middlewares/           # Error/validation/response helpers
      utils/                 # Game utilities and shared helpers
```

## Game Rules Implemented

### Tile Set

- Number tiles: `1..9`, each with 4 copies
- Dragon tiles: 4 copies
- Wind tiles: 4 copies

Total tiles per fresh deck: **44**

### Tile Values

- Number tile value = face value
- Dragon/Wind tile base value = `5`
- After each bet result:
  - If bet result is win: each non-number tile in the new hand is incremented by `+1`
  - If bet result is loss: each non-number tile in the new hand is decremented by `-1`
  - Values are clamped to range `0..10`

### Hand & Betting

- Hand size is always `3` tiles
- Player bets either:
  - `HIGHER`
  - `LOWER`
- Win condition:
  - `HIGHER` and new hand total > previous hand total
  - `LOWER` and new hand total < previous hand total
- Score updates:
  - Win: `+10`
  - Loss: `-5`

### Deck / Pile Management

- Previous current hand moves to discard pile before drawing next hand
- If draw pile has fewer than 3 tiles:
  - A fresh deck is generated
  - Fresh deck + discard pile are merged and shuffled
  - `reshuffleCount` increments

### Game Over Conditions

Game ends when either condition becomes true:

1. Any tracked non-number tile value reaches `0` or `10`
2. Draw pile would be exhausted for the 3rd time

## API Contract

Base path: `/api/v1`

### Health

- `GET /health`

### Game

- `POST /api/v1/game/start`
  - Starts a new game
- `POST /api/v1/game/bet`
  - Body:
    - `gameId` (24-char hex Mongo id)
    - `betType` (`HIGHER` | `LOWER`)
- `GET /api/v1/game/:gameId`
  - Fetches latest game state

### Leaderboard

- `GET /api/v1/leaderboard?limit=5`
  - Returns top scores descending
- `POST /api/v1/leaderboard/from-game`
  - Body:
    - `gameId`
    - `name` (2-100 chars)
  - Saves completed game score once per game

## Local Setup

### 1) Prerequisites

- Node.js (recommended: 20+)
- npm
- MongoDB connection string (local MongoDB or Atlas)

### 2) Clone and install

From repository root:

```bash
cd server
npm install

cd ../app
npm install
```

### 3) Environment variables

### Backend: `server/.env`

Create or update:

```env
PORT=3009
MONGODB_URI=mongodb://127.0.0.1:27017/mahjong_hand_bet
```

### Frontend: `app/.env`

```env
VITE_API_URL=http://localhost:3009
```

Notes:

- Frontend also has Vite proxy config for `/api` and `/health` to `http://localhost:3009`.
- CORS currently allows localhost/127.0.0.1 origins.

### 4) Run in development

Open two terminals:

### Terminal A (backend)

```bash
cd server
npm run dev
```

### Terminal B (frontend)

```bash
cd app
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## Build & Run Production

### Backend

```bash
cd server
npm run build
npm start
```

### Frontend

```bash
cd app
npm run build
npm run preview
```

## Available Scripts

### `server/package.json`

- `npm run dev` - run backend with hot reload using `ts-node-dev`
- `npm run build` - compile TypeScript to `dist/`
- `npm start` - run compiled backend from `dist/server.js`

### `app/package.json`

- `npm run dev` - run Vite dev server
- `npm run build` - type-check and build frontend
- `npm run preview` - preview production frontend build
- `npm run lint` - run ESLint

## Frontend Flow

1. `Landing` loads top 5 leaderboard entries and starts a game
2. `GameTable` shows:
   - current hand total and tile cards
   - draw/discard/score/reshuffle counters
   - bet buttons (higher/lower)
   - recent hand history
3. `Summary` shows final score and saves score to leaderboard

State is managed by:

- `gameSlice` for game lifecycle and bet state
- `leaderboardSlice` for leaderboard data and posting scores

## Backend Architecture

- `routes/*` maps endpoints
- `controllers/*` parse request/response
- `services/*` contains business logic
- `models/*` persists game and leaderboard entities
- `validators/*` uses Joi to validate body/query/params
- `middlewares/error.middleware.ts` centralizes errors

## Data Models

### Game

- `currentHand`: current 3 tiles
- `previousHands`: history of old hands
- `drawPile`, `discardPile`
- `tileValues`: per non-number tile dynamic value map
- `status`: `waiting | in_progress | completed`
- `score`
- `reshuffleCount`
- `leaderboardPosted`: prevents duplicate leaderboard submissions

### LeaderBoard

- `name`
- `score`
- timestamps

## Validation Rules

- `gameId`: required Mongo ObjectId (24 hex chars)
- `betType`: must be `HIGHER` or `LOWER`
- leaderboard `name`: required, min length 2, max 100
- leaderboard `limit`: integer 1..50, defaults to 5

## Troubleshooting

- **Backend fails to start**: check `MONGODB_URI`, Mongo access/network, and `PORT` in `server/.env`.
- **Frontend cannot call API**: verify `VITE_API_URL` in `app/.env` and ensure it points to a running backend (local: `http://localhost:3009`, deployed: `https://mahjong-game-g1ou.onrender.com`).
- **CORS issues**: use localhost origin or update CORS policy in `server/src/app.ts`
- **Empty leaderboard**: expected for fresh DB until a game is completed and submitted

## Current Implementation Notes

- `Summary` checks game-over reason using `DRAW_PILE_EXHAUSTED_3RD_TIME` while service currently returns `DRAW PILE EXHAUSTED 3RD TIME` (different format), so that reason-specific UI message may not appear.
- `GameTable` currently contains a debug `console.log(game, "game")`.
- No automated tests are included yet (`app` and `server`).

## Security Note

- Do not commit real secrets in `.env` files.
- Prefer using `.env.example` templates and environment-specific secret management in deployment.

## AI Usage Note (Assessment Requirement)

Update this section to reflect your exact process before submission:

- Handwritten by me:
  - Core game rules and backend business logic
  - Frontend Redux flow and screen integration
  - API integration and validation wiring
- AI-assisted:
  - README drafting/formatting and wording cleanup
  - Minor refactor suggestions and code review support


## Deployed URLs

### Backend (Render)

- Base URL: `https://mahjong-game-g1ou.onrender.com`
- Health check: `https://mahjong-game-g1ou.onrender.com/health`
- Game API base: `https://mahjong-game-g1ou.onrender.com/api/v1/game`
- Leaderboard API base: `https://mahjong-game-g1ou.onrender.com/api/v1/leaderboard`

### Frontend (Vercel)

- App URL: `https://mahjong-game-njukc7217-ghulamshubhanis-projects.vercel.app/`

