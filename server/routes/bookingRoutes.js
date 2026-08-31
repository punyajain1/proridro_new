import express from "express";
import {
    changeBookingStatus,
    getBookingById,
    getOwnerBookings,
    getUserBookings,
    cancelUserBooking,
    createOrder,
    verifyPayment,
    submitBooking
} from "../controllers/bookingController.js";
import rateLimit from 'express-rate-limit';
import { syncBooking } from "../controllers/syncController.js";
import { protect, protectOptional } from "../middleware/auth.js";

const bookingRouter = express.Router();

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30, // ORDER_GLOBAL_CAP
  message: { error: 'Payment service temporarily busy. Please try again later.' }
});

const verifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30, // VERIFY_CAP
  message: { error: 'Verification service busy. Please try again.' }
});

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60, // EMAIL_GLOBAL_CAP
  message: { error: 'Service is temporarily busy. Please try again shortly.' }
});

bookingRouter.post('/create-order', orderLimiter, protectOptional, createOrder);
bookingRouter.post('/verify-payment', verifyLimiter, protectOptional, verifyPayment);
bookingRouter.post('/submit', submitLimiter, protectOptional, submitBooking);

bookingRouter.post('/sync', syncBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, getOwnerBookings);
bookingRouter.post('/change-status', protect, changeBookingStatus);
bookingRouter.post('/cancel', protect, cancelUserBooking);
bookingRouter.get('/:bookingId', protectOptional, getBookingById);

export default bookingRouter;
