import express from 'express'; 

import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { calculateDailyROI } from './services/roiService.js';
import { calculateLevelIncome } from './services/referralService.js';

// Routes
import authRoutes from './routes/auth.js';
import investmentRoutes from './routes/investment.js';
import dashboardRoutes from './routes/dashboard.js';
import referralRoutes from './routes/referral.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nexachain')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referral', referralRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Cron job - runs daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily ROI calculation at midnight...');
  try {
    await calculateDailyROI();
    await calculateLevelIncome();
    console.log('Daily ROI and level income calculation completed');
  } catch (error) {
    console.error('Error in cron job:', error);
  }
}, {
  timezone: "Asia/Kolkata"
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

