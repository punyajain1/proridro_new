import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  terminal: { type: String },
  parking_charge_30: { type: Number, default: 0 },
  parking_charge_1: { type: Number, default: 0 },
  parking_charge_2: { type: Number, default: 0 },
  parking_charge_4: { type: Number, default: 0 },
  entry_fee: { type: Number, default: 0 },
  free_wait: { type: Number, default: 0 },
  overstay_penalty: { type: Number, default: 0 },
  toll_bus_30m: { type: Number, default: 0 },
  toll_car: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Airport', airportSchema);
