import mongoose from 'mongoose';

const levelIncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromInvestmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  amount: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  isProcessed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index to prevent duplicate calculations
levelIncomeSchema.index({ userId: 1, fromInvestmentId: 1, date: 1 }, { unique: true });

export default mongoose.model('LevelIncome', levelIncomeSchema);

