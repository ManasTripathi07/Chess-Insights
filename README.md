# Chess Insights Web App

A React-based chess insights application that fetches data from the Lichess API to provide player analysis and game details.

## Features

- **Player Search & Summary**: Enter a username to fetch games and view statistics
- **Games Table**: Display last 50 games with sorting and filtering options
- **Game Detail**: View opening analysis and deviation points
- **Stockfish Analysis** (Extra Credit): Python backend for game analysis

## Tech Stack

- Frontend: React (JavaScript)
- Styling: Tailwind CSS
- API: Lichess Public API
- Testing: Vitest
- Backend (Optional): Python with Flask/FastAPI

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

## Optional Python Backend

```bash
# Install Python dependencies
pip install flask python-chess stockfish

# Run Python server
python backend/app.py
```

## API Endpoints Used

- `GET /api/user/{username}/games` - Fetch user games
- `GET /api/game/{gameId}` - Fetch specific game details

## Project Structure

```
src/
├── components/
│   ├── PlayerSearch.jsx
│   ├── GamesList.jsx
│   ├── GameDetail.jsx
│   └── common/
├── hooks/
├── utils/
├── pages/
└── App.jsx
```