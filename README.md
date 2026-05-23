# TempSMS.io — Full-Stack Temporary SMS Receiver

## Stack
- **Frontend**: Next.js 14, Tailwind CSS, Zustand, Socket.io-client
- **Backend**: Express, TypeScript, MongoDB, Socket.io
- **Auth**: JWT + bcrypt
- **Providers**: SMS-Activate, 5SIM, SMSPool
- **Infra**: Docker + docker-compose

## Quick Start

```bash
# 1. Clone & configure
cp .env.example .env
# Edit .env with your keys

# 2. Docker
docker-compose up -d

# Frontend: http://localhost:3000
# Backend:  http://localhost:4000
```

## Dev (no Docker)

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

## Environment Variables

| Key | Description |
|-----|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `SMS_ACTIVATE_KEY` | SMS-Activate API key |
| `FIVESIM_KEY` | 5SIM API key |
| `SMSPOOL_KEY` | SMSPool API key |
| `NEXT_PUBLIC_API_URL` | Backend URL for frontend |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL for frontend |

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/numbers` | No | List active numbers |
| GET | `/api/numbers/:id` | No | Number + messages |
| POST | `/api/numbers/buy` | JWT | Buy temp number |
| DELETE | `/api/numbers/:id` | JWT | Cancel number |
| GET | `/api/sms/recent` | No | Recent SMS feed |
| GET | `/api/sms/history` | JWT | User SMS history |
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/keys` | JWT | List API keys |
| POST | `/api/keys` | JWT | Create API key |

## WebSocket Events

```
subscribe:number <id>    → join number room
sms:new                  → new SMS for subscribed number
sms:global               → any new SMS (home feed)
number:expired           → number expired
```

## Features
- ✅ Real-time SMS via WebSocket polling (5s)
- ✅ OTP extraction from SMS text
- ✅ Country filter
- ✅ Copy OTP/number button
- ✅ Admin panel (users, numbers, credits)
- ✅ API key system with usage tracking
- ✅ JWT auth + role-based access
- ✅ Rate limiting (100 req/15min global, 10 auth/15min)
- ✅ Dark mode (default)
- ✅ Mobile responsive
- ✅ Provider abstraction (swap providers easily)
- ✅ SMS history per user
- ✅ Number auto-expiry (20 min)
