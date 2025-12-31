# Architecture Diagram - API Configuration Fix

## BEFORE (Broken on Production) ❌

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOCAL DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser (http://localhost:3000)                               │
│  ├─ Vite Dev Server                                            │
│  │  └─ proxy: { '/api' → 'http://localhost:5000' }            │
│  └─ axios.get('/api/auth/register')                           │
│     └─ ✅ Proxied to http://localhost:5000/api/auth/register  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    NETLIFY PRODUCTION (Broken)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser (https://investmentco.netlify.app)                   │
│  └─ Built React App (static files)                            │
│     └─ axios.get('/api/auth/register')                        │
│        └─ ❌ Resolves to:                                      │
│           https://investmentco.netlify.app/api/auth/register  │
│           (404 - Netlify doesn't have /api route)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## AFTER (Fixed on Production) ✅

```
┌──────────────────────────────────────────────────────────────────┐
│                        LOCAL DEVELOPMENT                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Browser (http://localhost:3000)                                │
│  ├─ Vite Dev Server                                             │
│  │  └─ proxy: { '/api' → 'http://localhost:5000' } ← Still works
│  └─ axiosInstance.get('/api/auth/register')                    │
│     ├─ axiosConfig.js sets baseURL = env.VITE_API_URL         │
│     │  (= http://localhost:5000 from .env)                    │
│     └─ ✅ Both proxy AND config point to localhost:5000       │
│                                                                  │
│  (.env file in root: VITE_API_URL=http://localhost:5000)      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    NETLIFY PRODUCTION (Fixed!)                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Browser (https://investmentco.netlify.app)                    │
│  └─ Built React App (static files)                             │
│     └─ axiosInstance.get('/api/auth/register')                 │
│        ├─ axiosConfig.js sets baseURL from VITE_API_URL       │
│        │  (= https://your-actual-backend.com from Netlify env) │
│        └─ ✅ Resolves to:                                       │
│           https://your-actual-backend.com/api/auth/register    │
│           (✓ 200 OK - reaches your actual backend)             │
│                                                                  │
│  Netlify Environment Variables:                                 │
│  ├─ VITE_API_URL=https://your-backend-url.com                 │
│  └─ (Set in Netlify Dashboard at build time)                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Code Flow Diagram

```
┌─────────────────────┐
│  Component (*.jsx)  │
│                     │
│  import axiosConfig │
│  axiosInstance.get( │
│    '/api/auth/me'   │
│  )                  │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│        axiosConfig.js (NEW)                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  const API_URL =                                    │
│    import.meta.env.VITE_API_URL                     │
│    || 'http://localhost:5000'                       │
│                                                      │
│  axios.create({ baseURL: API_URL })                 │
│                                                      │
└──────────┬─────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  VITE_API_URL Environment Variable                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  LOCAL:        http://localhost:5000                │
│    ↓ (from .env file)                               │
│                                                      │
│  PRODUCTION:   https://your-backend.com             │
│    ↓ (from Netlify Dashboard Environment)           │
│                                                      │
│  FINAL REQUEST:                                     │
│    {VITE_API_URL}/api/auth/me                       │
│                                                      │
└──────────┬─────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  Backend Server                                      │
├──────────────────────────────────────────────────────┤
│  http://localhost:5000  (LOCAL)                      │
│  https://your-backend.com  (PRODUCTION)              │
└──────────────────────────────────────────────────────┘
```

## File Structure

```
frontend/
├── .env                          ← LOCAL development config
│   └─ VITE_API_URL=http://localhost:5000
│
├── .env.example                  ← Reference template
│   └─ Shows both local & production examples
│
├── src/
│   ├── config/
│   │   └── axiosConfig.js        ← ✨ NEW: Centralized axios config
│   │       └─ Reads VITE_API_URL
│   │
│   ├── context/
│   │   └── AuthContext.jsx       ← UPDATED: Uses axiosConfig
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx         ← UPDATED
│   │   ├── Investments.jsx       ← UPDATED
│   │   ├── Referral.jsx          ← UPDATED
│   │   └── Wallet.jsx            ← UPDATED
│   │
│   └── components/
│       ├── CreateInvestmentModal.jsx  ← UPDATED
│       └── DashboardLayout.jsx        ← UPDATED
│
└── vite.config.js                ← UPDATED: Now loads env variables
```

## Request Flow: Before vs After

### BEFORE: Breaking on Netlify
```
Component
  └─ import axios
     └─ axios.get('/api/register')
        └─ No baseURL set
           └─ Browser resolves relative URL
              └─ https://investmentco.netlify.app/api/register
                 └─ ❌ 404 NOT FOUND
```

### AFTER: Works Everywhere
```
Component
  └─ import axiosInstance
     └─ axiosInstance.get('/api/register')
        └─ axiosConfig has baseURL = VITE_API_URL
           └─ LOCAL: baseURL = http://localhost:5000
              └─ Request: http://localhost:5000/api/register ✅
           
           └─ PRODUCTION: baseURL = https://your-backend.com
              └─ Request: https://your-backend.com/api/register ✅
```

---

**Key Point:** Environment variables tell the app which backend to use!
