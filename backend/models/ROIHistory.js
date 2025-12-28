import mongoose from 'mongoose';

const roiHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  calculatedAt: {
    type: Date,
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
roiHistorySchema.index({ userId: 1, investmentId: 1, date: 1 }, { unique: true });

export default mongoose.model('ROIHistory', roiHistorySchema);

