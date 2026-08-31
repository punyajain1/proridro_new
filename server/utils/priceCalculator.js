import Car from '../models/Car.js';
import Airport from '../models/Airport.js';
import Addon from '../models/Addon.js';

export const computePrice = async (bookingData) => {
  const carId = bookingData.carId || bookingData.car_id;
  const serviceType = bookingData.serviceType || bookingData.service_type;
  const cityPackage = bookingData.cityPackage || bookingData.city_package;
  const airportId = bookingData.airportId || bookingData.airport_id;
  const pickupDate = bookingData.pickupDate || bookingData.pickup_date;
  const pickupTime = bookingData.pickupTime || bookingData.pickup_time;
  const outstationDays = bookingData.outstationDays || bookingData.outstation_days;
  const outDropDate = bookingData.outDropDate || bookingData.out_drop_date;
  const outDropTime = bookingData.outDropTime || bookingData.out_drop_time;
  const extraKmRequested = bookingData.extraKmRequested || bookingData.extra_km_requested;
  
  let addons = bookingData.addons || [];
  if (bookingData.addons_json && typeof bookingData.addons_json === 'string') {
    try {
      addons = JSON.parse(bookingData.addons_json);
    } catch (e) {
      console.error('Error parsing addons_json', e);
    }
  }

  const days = serviceType === 'outstation' ? Math.max(1, parseInt(outstationDays || '1', 10)) : 1;
  const extraKm = Math.max(0, parseInt(extraKmRequested || '0', 10) || 0);
  
  const addonSelections = (addons || []).map(a => ({
    id: String(a.id || '').trim(),
    option: String(a.option || '').trim().toLowerCase()
  })).filter(a => a.id && a.option);

  // Time calculations for night allowance
  let nightUnits = 0;
  const _pickupHour = pickupTime ? parseInt(String(pickupTime).split(':')[0] || '0', 10) : null;
  
  const parseIST = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    return new Date(`${dateStr}T${timeStr}:00+05:30`);
  };

  const countNightWindows = (start, end) => {
    if (!start || !end) return 0;
    if (+end <= +start) return 0;
    let count = 0;
    let cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    cursor.setDate(cursor.getDate() - 1);
    for (let i = 0; i < 60; i++) {
      let nightStart = new Date(cursor);
      nightStart.setHours(22, 0, 0, 0);
      let nightEnd = new Date(cursor);
      nightEnd.setDate(nightEnd.getDate() + 1);
      nightEnd.setHours(6, 0, 0, 0);
      if (+nightStart >= +end) break;
      if (+nightEnd > +start && +nightStart < +end) count++;
      cursor.setDate(cursor.getDate() + 1);
    }
    return count;
  };

  if (serviceType === 'outstation') {
    let start = parseIST(pickupDate, pickupTime);
    let end = parseIST(outDropDate, outDropTime);
    nightUnits = countNightWindows(start, end);
    if (!nightUnits) {
      nightUnits = Math.max(0, days - 1);
    }
  } else {
    nightUnits = (_pickupHour !== null && !isNaN(_pickupHour) && (_pickupHour >= 22 || _pickupHour < 6)) ? 1 : 0;
  }

  // Fetch Car
  const car = await Car.findOne({ id: carId });
  if (!car) return 0;

  let basePrice = 0;
  if (serviceType === 'city') {
    if (String(cityPackage) === '4') {
      basePrice = parseFloat(car.city_full_day_price || 0);
    } else {
      const pkg = Math.min(Math.max(parseInt(cityPackage) || 1, 1), 3);
      basePrice = parseFloat(car[`city_base_price_${pkg}`] || car.city_base_price_1 || 0);
    }
  } else if (serviceType === 'outstation') {
    basePrice = parseFloat(car.outstation_base_price || 0) * days;
  } else if (serviceType === 'pickup' || serviceType === 'drop') {
    basePrice = parseFloat(car.airport_base_price || 0);
  }

  let airportCharges = 0;
  if ((serviceType === 'pickup' || serviceType === 'drop') && airportId) {
    const airport = await Airport.findOne({ id: airportId });
    if (airport) {
      airportCharges += parseFloat(airport.entry_fee || 0);
      airportCharges += parseFloat(airport.toll_car || 0);
      if (serviceType === 'pickup') {
        airportCharges += parseFloat(airport.parking_charge_30 || 0);
      }
    }
  }

  let driverAllowance = 0;
  if (serviceType === 'outstation') {
    const allowancePerDay = parseFloat(car.driver_allowance_day || 0) || 0;
    const allowancePerNight = parseFloat(car.driver_allowance_night || car.driver_allowance_day || 750);
    driverAllowance = Math.max(0, (allowancePerDay * Math.max(1, days)) + (allowancePerNight * Math.max(0, nightUnits)));
  } else {
    if (pickupTime) {
      const allowancePerNight = parseFloat(car.driver_allowance_night || car.driver_allowance_day || 750);
      driverAllowance = allowancePerNight * Math.max(0, nightUnits);
    }
  }

  let extraKmCharge = 0;
  if (extraKm > 0) {
    extraKmCharge = extraKm * parseFloat(car.extra_km_rate || 0);
  }

  let addonsCharge = 0;
  if (addonSelections.length > 0) {
    for (const sel of addonSelections) {
      // Find all options for this addon ID
      const addonOptions = await Addon.find({ id: sel.id });
      // Find the specific option the user selected (case-insensitive, ignoring special regex chars)
      const addon = addonOptions.find(a => 
        String(a.option || '').trim().toLowerCase() === sel.option
      );
      if (addon) {
         addonsCharge += parseFloat(addon.price || 0);
      }
    }
  }

  const totalRupees = basePrice + airportCharges + driverAllowance + extraKmCharge + addonsCharge;
  const paise = Math.round(totalRupees * 100);

  return paise;
};
