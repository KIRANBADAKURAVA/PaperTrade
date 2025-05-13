import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  tradeType: {
    type: String,
    enum: ['long', 'short'],
    default: 'long'
  },
  status: {
    type: String,
    enum: ['pending', 'open', 'closed'],
    default: 'open'
  },
  entryPrice: {
    type: Number,
    min: 0,
    required: true
  },
  exitPrice: {
    type: Number,
    min: 0
  },
  profitLoss: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true 
});

const Position = mongoose.model('Position', positionSchema);

export default Position;
