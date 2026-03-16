import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, default: '' },
    referenceType: { type: String, default: '' },
    referenceId: { type: String, default: '' }
  },
  { timestamps: true }
);

const WalletTransaction =
  mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', walletTransactionSchema);

export default WalletTransaction;
