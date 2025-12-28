import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  plan: {
    type: String,
    required: true,
    enum: ['Basic', 'Premium', 'Gold', 'Platinum']
  },
  planDetails: {
    dailyROI: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true // in days
    }
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  totalROIEarned: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate end date based on duration
investmentSchema.pre('save', function(next) {
  if (this.isNew && this.planDetails.duration) {
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + this.planDetails.duration);
    this.endDate = endDate;
  }
  next();
});

export default mongoose.model('Investment', investmentSchema);

