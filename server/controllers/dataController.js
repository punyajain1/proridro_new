import Car from '../models/Car.js';
import Airport from '../models/Airport.js';
import Addon from '../models/Addon.js';
import NodeCache from 'node-cache';

// Cache for 5 minutes (300 seconds)
const myCache = new NodeCache({ stdTTL: 300 });

export const getBookingData = async (req, res) => {
  try {
    // Check if data is in cache
    const cacheKey = 'bookingData';
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // If not in cache, fetch from database
    const fleet = await Car.find({});
    const airports = await Airport.find({});
    const addons = await Addon.find({});

    const responseData = {
      fleet,
      airports,
      addons
    };

    // Store in cache
    myCache.set(cacheKey, responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching booking data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch booking data' });
  }
};

export const updateCarData = async (req, res) => {
  try {
    const { id } = req.params; // this could be MongoDB _id or the custom id field.
    const updateData = req.body;

    // Use _id if it's a valid ObjectId, otherwise we might need to query by custom 'id' field
    // Let's assume the frontend passes the MongoDB _id
    const updatedCar = await Car.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedCar) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }

    // Clear cache since data has changed
    myCache.del('bookingData');

    res.status(200).json({ success: true, car: updatedCar });
  } catch (error) {
    console.error('Error updating car data:', error);
    res.status(500).json({ success: false, error: 'Failed to update car data' });
  }
};

export const addCarData = async (req, res) => {
  try {
    const newCarData = req.body;
    
    // Generate a unique id if not provided
    if (!newCarData.id) {
      const highestCar = await Car.findOne().sort('-id').exec();
      newCarData.id = highestCar && highestCar.id ? highestCar.id + 1 : 1;
    }

    // Create new car
    const newCar = await Car.create(newCarData);
    
    // Clear cache since data has changed
    myCache.del('bookingData');

    res.status(201).json({ success: true, car: newCar });
  } catch (error) {
    console.error('Error adding car data:', error);
    res.status(500).json({ success: false, error: 'Failed to add car data' });
  }
};

export const deleteCarData = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }

    // Clear cache
    myCache.del('bookingData');

    res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car data:', error);
    res.status(500).json({ success: false, error: 'Failed to delete car data' });
  }
};
