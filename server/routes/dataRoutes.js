import express from 'express';
import { getBookingData, updateCarData, addCarData, deleteCarData } from '../controllers/dataController.js';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter for data fetching (matching the GAS GET_CAP of 200 per hour)
const dataLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200,
  message: { error: 'Service temporarily busy. Please try again later.' }
});

router.get('/booking-data', protect, dataLimiter, getBookingData);
router.post('/cars', protect, addCarData);
router.put('/cars/:id', protect, updateCarData);
router.delete('/cars/:id', protect, deleteCarData);

export default router;
