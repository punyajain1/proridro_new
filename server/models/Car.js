import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  brand: { type: String },
  seating: { type: String },
  luggage: { type: String },
  airport_base_price: { type: Number, default: 0 },
  city_base_price_1: { type: Number, default: 0 },
  city_base_price_2: { type: Number, default: 0 },
  city_base_price_3: { type: Number, default: 0 },
  city_full_day_price: { type: Number, default: 0 },
  outstation_base_price: { type: Number, default: 0 },
  driver_allowance_day: { type: Number, default: 0 },
  driver_allowance_night: { type: Number, default: 0 },
  extra_hour_rate: { type: Number, default: 0 },
  extra_km_rate: { type: Number, default: 0 },
  waiting_per_hour: { type: Number, default: 0 },
  airport_included_km: { type: Number, default: 0 },
  airport_included_hours: { type: Number, default: 0 },
  city_included_km_1: { type: Number, default: 0 },
  city_included_hours_1: { type: Number, default: 0 },
  city_included_km_2: { type: Number, default: 0 },
  city_included_hours_2: { type: Number, default: 0 },
  city_included_km_3: { type: Number, default: 0 },
  city_included_hours_3: { type: Number, default: 0 },
  city_full_day_km: { type: Number, default: 0 },
  outstation_included_km: { type: Number, default: 0 },
  outstation_included_hours: { type: Number, default: 0 },
  includes: { type: String },
  excludes: { type: String },
  image: { type: String },
  starting_from: { type: Number, default: 0 },
  product_url: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('Car', carSchema);
