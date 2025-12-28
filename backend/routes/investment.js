import express from 'express';
import Investment from '../models/Investment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Investment plans configuration
const INVESTMENT_PLANS = {
  Basic: {
    dailyROI: 2, // 2% daily
    duration: 30 // 30 days
  },
  Premium: {
    dailyROI: 3, // 3% daily
    duration: 45 // 45 days
  },
  Gold: {
    dailyROI: 4, // 4% daily
    duration: 60 // 60 days
  },
  Platinum: {
    dailyROI: 5, // 5% daily
    duration: 90 // 90 days
  }
};

// Create investment
router.post('/create', authenticate, async (req, res) => {
  try {
    const { amount, plan } = req.body;

    if (!amount || !plan) {
      return res.status(400).json({ message: 'Amount and plan are required' });
    }

    if (!INVESTMENT_PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid investment plan' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const planDetails = INVESTMENT_PLANS[plan];

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + planDetails.duration);

    const investment = new Investment({
      userId: req.user._id,
      amount,
      plan,
      planDetails,
      startDate,
      endDate
    });

    await investment.save();

    res.status(201).json({
      message: 'Investment created successfully',
      investment: {
        id: investment._id,
        amount: investment.amount,
        plan: investment.plan,
        startDate: investment.startDate,
        endDate: investment.endDate,
        status: investment.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user investments
router.get('/my-investments', authenticate, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ investments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

