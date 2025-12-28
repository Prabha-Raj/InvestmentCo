import express from 'express';
import User from '../models/User.js';
import Referral from '../models/Referral.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get referral tree
router.get('/tree', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const buildTree = async (userId, level = 0, maxLevel = 5) => {
      if (level > maxLevel) return null;

      const user = await User.findById(userId).select('username email referralCode createdAt');
      if (!user) return null;

      // Get direct referrals
      const referrals = await Referral.find({ referrerId: userId, level: 1 });
      
      const children = await Promise.all(
        referrals.map(async (ref) => {
          return await buildTree(ref.referredId, level + 1, maxLevel);
        })
      );

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          referralCode: user.referralCode,
          createdAt: user.createdAt
        },
        children: children.filter(child => child !== null)
      };
    };

    const tree = await buildTree(userId);
    res.json({ tree });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get referral statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total referrals by level
    const referralsByLevel = await Referral.aggregate([
      {
        $match: { referrerId: userId }
      },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get total level income by level
    const incomeByLevel = await Referral.aggregate([
      {
        $match: { referrerId: userId }
      },
      {
        $lookup: {
          from: 'levelincomes',
          localField: 'referredId',
          foreignField: 'fromUserId',
          as: 'incomes'
        }
      },
      {
        $unwind: '$incomes'
      },
      {
        $match: {
          'incomes.userId': userId
        }
      },
      {
        $group: {
          _id: '$level',
          totalIncome: { $sum: '$incomes.amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      referralsByLevel,
      incomeByLevel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

