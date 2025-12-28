import Investment from '../models/Investment.js';
import ROIHistory from '../models/ROIHistory.js';
import User from '../models/User.js';

export const calculateDailyROI = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active investments
    const activeInvestments = await Investment.find({
      status: 'active',
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    console.log(`Calculating ROI for ${activeInvestments.length} active investments`);

    for (const investment of activeInvestments) {
      // Check if ROI already calculated for today
      const existingROI = await ROIHistory.findOne({
        userId: investment.userId,
        investmentId: investment._id,
        date: today
      });

      if (existingROI && existingROI.isProcessed) {
        console.log(`ROI already calculated for investment ${investment._id} on ${today}`);
        continue;
      }

      // Calculate daily ROI amount
      const dailyROIAmount = (investment.amount * investment.planDetails.dailyROI) / 100;

      // Create or update ROI history
      const roiHistory = await ROIHistory.findOneAndUpdate(
        {
          userId: investment.userId,
          investmentId: investment._id,
          date: today
        },
        {
          userId: investment.userId,
          investmentId: investment._id,
          amount: dailyROIAmount,
          date: today,
          isProcessed: false
        },
        { upsert: true, new: true }
      );

      // Update investment total ROI earned
      await Investment.findByIdAndUpdate(investment._id, {
        $inc: { totalROIEarned: dailyROIAmount }
      });

      // Update user balance and total earnings
      await User.findByIdAndUpdate(investment.userId, {
        $inc: {
          balance: dailyROIAmount,
          totalEarnings: dailyROIAmount
        }
      });

      // Mark as processed
      await ROIHistory.findByIdAndUpdate(roiHistory._id, {
        isProcessed: true
      });

      console.log(`ROI calculated: ${dailyROIAmount} for investment ${investment._id}`);
    }

    // Check for completed investments
    const completedInvestments = await Investment.find({
      status: 'active',
      endDate: { $lt: today }
    });

    for (const investment of completedInvestments) {
      await Investment.findByIdAndUpdate(investment._id, {
        status: 'completed'
      });
      console.log(`Investment ${investment._id} marked as completed`);
    }

    return { success: true, processed: activeInvestments.length };
  } catch (error) {
    console.error('Error calculating daily ROI:', error);
    throw error;
  }
};

