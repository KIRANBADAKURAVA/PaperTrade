import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
  accountId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  symbol:      { type: String, required: true },
  quantity:    { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

const Position = mongoose.model('Position', positionSchema);
export default Position;
