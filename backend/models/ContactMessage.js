import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    interest: { type: String, default: '', trim: true },
    message: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;

