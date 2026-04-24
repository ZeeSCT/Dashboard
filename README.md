# Scientechnic Unified Platform Dashboard with Auth

## Setup
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## .env.local
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Expected backend APIs:
- POST /api/v1/auth/login
- POST /api/v1/auth/register
