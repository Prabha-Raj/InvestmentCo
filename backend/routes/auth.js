import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Referral from '../models/Referral.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Find referrer if referral code provided
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      referredBy
    });

    await user.save();

    // Create referral relationships if referred
    if (referredBy) {
      await createReferralChain(referredBy, user._id);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error('Register Error:', error);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user (Me)
import { authenticate } from '../middleware/auth.js';

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      referralCode: user.referralCode,
      balance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to create referral chain
async function createReferralChain(referrerId, referredId, level = 1) {
  if (level > 10) return; // Max 10 levels

  const referrer = await User.findById(referrerId);
  if (!referrer) return;

  // Create referral relationship
  await Referral.findOneAndUpdate(
    { referrerId, referredId },
    { referrerId, referredId, level },
    { upsert: true }
  );

  // Continue up the chain
  if (referrer.referredBy) {
    await createReferralChain(referrer.referredBy, referredId, level + 1);
  }
}

export default router;

