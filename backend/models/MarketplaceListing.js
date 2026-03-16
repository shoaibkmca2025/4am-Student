import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['notes', 'ppt-template', 'design', 'study-guide'],
      required: true
    },
    price: { type: Number, required: true, min: 0 },
    downloads: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const MarketplaceListing =
  mongoose.models.MarketplaceListing || mongoose.model('MarketplaceListing', marketplaceListingSchema);

export default MarketplaceListing;
