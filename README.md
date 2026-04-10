# Quote Quest

A real-time stock quote lookup web application built with Angular and NestJS. To view the Production deployed application, visit https://triumphant-alignment-production-2609.up.railway.app/login. Otherwise, the setup for local deployment is below.

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
- PostgreSQL
- JWT Authentication
- Cache Manager

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (v12 or higher)
- Git

## Local Setup

### Backend

### Clone the repo
```bash
git clone https://github.com/your-username/quick_stock.git
cd quick_stock/backend
npm install
```

### Start PostgrSQL
```bash
# macOS (using Homebrew)
brew services start postgresql

# Or manually
postgres -D /usr/local/var/postgres

# Then run this to create the DB
psql postgres
```

Once running, enter this into the prompt:
```SQL
CREATE DATABASE b;
\q
```

You should be able to test the local DB with the following command. If it doesn't error out, you are up and running:
```bash
psql -d b
```

### Setup Envinronment files
```bash
cp .env.example .env.local
```
Make sure you modify the values for the local environment file to match values necessary for spinning up the application.psql postgres

### Build and Start
```bash
cd backend
npm run build      # Build only
npm run start:dev  # Dev mode with watch
```

Backend runs on http://localhost:3000 upon startup. It should also have a DB spun up and seeded with one test user. 

To run the tests in the backend, simply run this command in the backend directory:

```bash
npm run test:cov
```

### Frontend

```bash
cd frontend
npm install
npm run ng -- serve --open
```

Visit http://localhost:4200 once backend and front end are spun up.