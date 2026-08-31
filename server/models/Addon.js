import mongoose from 'mongoose';

const addonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String },
  option: { type: String },
  price: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Addon', addonSchema);
