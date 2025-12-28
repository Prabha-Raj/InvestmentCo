import express from 'express';
import Investment from '../models/Investment.js';
import ROIHistory from '../models/ROIHistory.js';
import LevelIncome from '../models/LevelIncome.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

import { calculateDailyROI } from '../services/roiService.js';
import { calculateLevelIncome } from '../services/referralService.js';

const router = express.Router();

// Trigger daily ROI calculation manually (for testing)
router.post('/simulate-roi', authenticate, async (req, res) => {
  try {
    console.log('Manually triggering ROI calculation...');
    await calculateDailyROI();
    await calculateLevelIncome();
    res.json({ message: 'Daily revenue simulation completed successfully' });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ message: error.message });
  }
});



// Get dashboard data
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all investments
    const investments = await Investment.find({ userId })
      .sort({ createdAt: -1 });

    // Calculate total investments
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);

    // Get active investments
    const activeInvestments = investments.filter(inv => inv.status === 'active');

    // Get today's ROI
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayROI = await ROIHistory.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const dailyROI = todayROI.length > 0 ? todayROI[0].total : 0;

    // Get total ROI earned
    const totalROI = await ROIHistory.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalROIEarned = totalROI.length > 0 ? totalROI[0].total : 0;

    // Get total level income
    const totalLevelIncome = await LevelIncome.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const levelIncome = totalLevelIncome.length > 0 ? totalLevelIncome[0].total : 0;

    // Get user balance
    const user = await User.findById(userId);

    // Get last 7 days ROI history for chart
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const roiHistory = await ROIHistory.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format chart data (fill missing days with 0)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = roiHistory.find(h => h._id === dateStr);
      chartData.push({
        date: dateStr,
        amount: found ? found.amount : 0
      });
    }

    res.json({
      totalInvestments,
      activeInvestments: activeInvestments.length,
      dailyROI,
      totalROIEarned,
      levelIncome,
      balance: user.balance,
      totalEarnings: user.totalEarnings,
      chartData,
      investments: investments.map(inv => ({
        id: inv._id,
        amount: inv.amount,
        plan: inv.plan,
        startDate: inv.startDate,
        endDate: inv.endDate,
        status: inv.status,
        totalROIEarned: inv.totalROIEarned
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

