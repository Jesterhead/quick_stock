# Quote Quest

A real-time stock quote lookup web application built with Angular and NestJS.

## Features

- 🔐 User authentication with JWT
- 📈 Real-time stock price lookups via Finnhub API
- 🔒 Account lockout after failed login attempts
- 💾 Search history caching
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

**Frontend:**
- Angular 18
- Tailwind CSS
- TypeScript

**Backend:**
- NestJS
- TypeORM
- SQLite/PostgreSQL
- JWT Authentication
- Cache Manager

## Prerequisites

- Node.js 18+
- npm or yarn

## Local Setup

### Backend

### Clone the repo
```bash
git clone https://github.com/your-username/quick_stock.git
cd quick_stock/backend
npm install
```

### Setup Envinronment files
```bash
cp .env.example .env
```

### Build and Start
```bash
cd backend
npm run build      # Build only
npm run start:dev  # Dev mode with watch
```

Backend runs on http://localhost:3000 upon startup. It should also have a DB spun up and seeded with one test user. 

### Frontend

```bash
cd frontend
npm install
ng serve
```

Visit http://localhost:4200 once backend and front end are spun up.