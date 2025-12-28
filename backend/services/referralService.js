import User from '../models/User.js';
import Investment from '../models/Investment.js';
import Referral from '../models/Referral.js';
import LevelIncome from '../models/LevelIncome.js';
import ROIHistory from '../models/ROIHistory.js';

// Level income percentages (1% for level 1, 0.5% for level 2, etc.)
const LEVEL_INCOME_PERCENTAGES = {
  1: 1.0,
  2: 0.5,
  3: 0.3,
  4: 0.2,
  5: 0.1,
  6: 0.05,
  7: 0.05,
  8: 0.05,
  9: 0.05,
  10: 0.05
};

export const calculateLevelIncome = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all ROI entries from today that haven't been processed for level income
    const todayROIEntries = await ROIHistory.find({
      date: today,
      isProcessed: true
    }).populate('investmentId');

    console.log(`Calculating level income for ${todayROIEntries.length} ROI entries`);

    for (const roiEntry of todayROIEntries) {
      if (!roiEntry.investmentId) continue;

      const investment = roiEntry.investmentId;
      const referredUser = await User.findById(investment.userId);

      if (!referredUser || !referredUser.referredBy) {
        continue; // User has no referrer
      }

      // Traverse up the referral chain
      // Level income is calculated based on ROI earned, not investment amount
      await calculateIncomeForChain(
        referredUser.referredBy,
        investment._id,
        roiEntry.amount, // Use ROI amount instead of investment amount
        investment.userId,
        1
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error calculating level income:', error);
    throw error;
  }
};

async function calculateIncomeForChain(referrerId, investmentId, roiAmount, fromUserId, level) {
  if (level > 10 || !referrerId) return;

  try {
    const referrer = await User.findById(referrerId);
    if (!referrer) return;

    const percentage = LEVEL_INCOME_PERCENTAGES[level] || 0;
    if (percentage <= 0) return;

    // Level income is a percentage of the ROI earned by the referred user
    const levelIncomeAmount = (roiAmount * percentage) / 100;

    // Check if level income already calculated for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingIncome = await LevelIncome.findOne({
      userId: referrerId,
      fromInvestmentId: investmentId,
      date: today
    });

    if (existingIncome && existingIncome.isProcessed) {
      // Continue up the chain
      if (referrer.referredBy) {
        await calculateIncomeForChain(
          referrer.referredBy,
          investmentId,
          roiAmount,
          fromUserId,
          level + 1
        );
      }
      return;
    }

    // Create level income record
    const levelIncome = await LevelIncome.findOneAndUpdate(
      {
        userId: referrerId,
        fromInvestmentId: investmentId,
        date: today
      },
      {
        userId: referrerId,
        fromUserId: fromUserId,
        fromInvestmentId: investmentId,
        level: level,
        amount: levelIncomeAmount,
        percentage: percentage,
        date: today,
        isProcessed: false
      },
      { upsert: true, new: true }
    );

    // Update referrer's balance and total level income
    await User.findByIdAndUpdate(referrerId, {
      $inc: {
        balance: levelIncomeAmount,
        totalEarnings: levelIncomeAmount,
        totalLevelIncome: levelIncomeAmount
      }
    });

    // Mark as processed
    await LevelIncome.findByIdAndUpdate(levelIncome._id, {
      isProcessed: true
    });

    console.log(`Level ${level} income: ${levelIncomeAmount} for user ${referrerId}`);

    // Continue up the chain
    if (referrer.referredBy) {
      await calculateIncomeForChain(
        referrer.referredBy,
        investmentId,
        roiAmount,
        fromUserId,
        level + 1
      );
    }
  } catch (error) {
    console.error(`Error calculating level income for level ${level}:`, error);
  }
}

