# 🔧 Production API Configuration - Fixed!

## Problem
The frontend was making API calls to `https://investmentco.netlify.app/api/...` instead of your actual backend, causing 404 errors. This happened because:
- Vite's proxy only works in local development (`npm run dev`)
- Production build (Netlify) has no proxy

## Solution Implemented ✅

### 1. Created Centralized Axios Config
**File:** `frontend/src/config/axiosConfig.js`
- Reads `VITE_API_URL` environment variable
- Sets it as baseURL for ALL axios requests
- Automatically routes `/api/auth/register` → `{VITE_API_URL}/api/auth/register`

### 2. Updated All Components
Changed from:
```javascript
import axios from 'axios';
axios.get('/api/auth/me')
```

To:
```javascript
import axiosInstance from '../config/axiosConfig';
axiosInstance.get('/api/auth/me')
```

**Updated Files:**
- AuthContext.jsx ✅
- Dashboard.jsx ✅
- Investments.jsx ✅
- Referral.jsx ✅
- Wallet.jsx ✅
- CreateInvestmentModal.jsx ✅
- DashboardLayout.jsx ✅

### 3. Environment Configuration

**`.env`** (Local Development)
```
VITE_PORT=3000
VITE_API_URL=http://localhost:5000
```

**Production (Netlify Dashboard)**
Add environment variable:
```
VITE_API_URL=https://your-actual-backend-url.com
```

## 🚀 NEXT STEPS - What You Need to Do

### Step 1: Find Your Backend URL
Where is your backend deployed?
- AWS? → e.g., `https://api-xxxxx.us-east-1.amazonaws.com`
- Heroku? → e.g., `https://mynexachain-backend.herokuapp.com`
- Custom server? → e.g., `https://api.yourdomain.com`

### Step 2: Add to Netlify Environment Variables
1. Go to: **Netlify Dashboard** → Your Site → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add:
   ```
   Variable name: VITE_API_URL
   Value: https://your-backend-url.com (WITHOUT /api at end)
   ```
4. Save

### Step 3: Redeploy
Option A: Push to git (auto-deploys)
```bash
git add .
git commit -m "Fix API configuration for production"
git push
```

Option B: Manual trigger in Netlify
- Dashboard → Deploys → Trigger deploy

### Step 4: Configure Backend CORS
Update your backend to allow Netlify domain:

**Express.js Example:**
```javascript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://investmentco.netlify.app',
    'http://localhost:3000'
  ]
}));
```

### Step 5: Verify
1. Visit `https://investmentco.netlify.app`
2. Open DevTools → Network tab
3. Try to register/login
4. Check if API requests go to your backend (not investmentco.netlify.app)
5. Should see URLs like: `https://your-backend-url.com/api/auth/register`

## 📝 Local Testing (Should Already Work)
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000` - should connect to `http://localhost:5000`

## Checklist
- [ ] Find backend URL
- [ ] Add `VITE_API_URL` to Netlify environment variables
- [ ] Redeploy on Netlify
- [ ] Update backend CORS settings
- [ ] Test registration/login on production
- [ ] Check DevTools Network tab to verify correct API URLs

Need help? Check `API_CONFIGURATION.md` for detailed troubleshooting.
