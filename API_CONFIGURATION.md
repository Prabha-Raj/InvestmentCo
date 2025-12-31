# API Configuration Guide

## Environment Variables Setup

The frontend now uses environment variables to configure the API URL for different environments.

### Files Created/Modified:

1. **`src/config/axiosConfig.js`** - Centralized axios configuration
   - Reads `VITE_API_URL` from environment
   - Sets baseURL for all API requests
   - Includes response interceptors for error handling

2. **`.env`** - Local development environment
   ```
   VITE_PORT=3000
   VITE_API_URL=http://localhost:5000
   ```

3. **`.env.example`** - Template for developers
   - Shows local development settings
   - Includes comment for production usage

### How It Works

#### Local Development
- Vite dev server runs on port 3000
- All axios requests use `VITE_API_URL=http://localhost:5000` as baseURL
- Example: `axiosInstance.get('/api/auth/me')` → `http://localhost:5000/api/auth/me`

#### Production (Netlify)
1. **Set environment variable in Netlify Dashboard:**
   - Go to: Build & deploy > Environment
   - Add variable: `VITE_API_URL=https://your-backend-url.com`
   
2. **During build, Vite will use this URL:**
   - Example: `axiosInstance.post('/api/auth/register')` → `https://your-backend-url.com/api/auth/register`

### Files Updated

All the following files now use the centralized `axiosConfig`:

- ✅ `src/context/AuthContext.jsx`
- ✅ `src/pages/Dashboard.jsx`
- ✅ `src/pages/Investments.jsx`
- ✅ `src/pages/Referral.jsx`
- ✅ `src/pages/Wallet.jsx`
- ✅ `src/components/CreateInvestmentModal.jsx`
- ✅ `src/components/DashboardLayout.jsx`

### Steps to Fix Production

1. **Find your backend URL** (e.g., `https://api.investmentco.com` or similar)

2. **Add to Netlify Environment Variables:**
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.com
   ```

3. **Redeploy on Netlify:**
   - Push to git or trigger rebuild in Netlify dashboard
   - The build process will embed the correct API URL

4. **Backend CORS Configuration:**
   - Ensure your backend allows requests from `https://investmentco.netlify.app`
   - Example (Node.js/Express):
     ```javascript
     app.use(cors({
       origin: ['https://investmentco.netlify.app', 'http://localhost:3000']
     }));
     ```

### Testing

**Local Testing:**
```bash
cd frontend
npm install
npm run dev
# Visits http://localhost:3000 with API calls to http://localhost:5000
```

**Production Testing:**
- Check browser network tab to verify API URLs
- Should see requests to your actual backend domain, not investmentco.netlify.app

### Troubleshooting

If you still see 404 errors on production:

1. Verify backend URL is correct: `echo $VITE_API_URL` (in Netlify build logs)
2. Check backend CORS settings allow your Netlify domain
3. Ensure backend is deployed and running
4. Clear browser cache and rebuild on Netlify

