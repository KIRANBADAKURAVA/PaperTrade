import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  symbol:    { type: String, required: true },
  action:    { type: String, enum: ['buy', 'sell'], required: true },
  quantity:  { type: Number, required: true },
  price:     { type: Number, required: true },
  orderType: { type: String, enum: ['market', 'limit'], default: 'market' },
  status:    { type: String, enum: ['executed', 'cancelled', 'pending'], default: 'executed' },
  timestamp: { type: Date, default: Date.now }
});

const Trade = mongoose.model('Trade', tradeSchema);
export default Trade;
