import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 100000 },
  currency: { type: String, default: 'USD' },
  createdAt: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', accountSchema);
export default Account;
