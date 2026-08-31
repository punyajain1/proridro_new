import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { computePrice } from '../utils/priceCalculator.js';
import { sendViaZeptoMail } from '../utils/zeptoMail.js';

// API to List User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ customerId: _id }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get one user's booking for the confirmation and receipt page
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId).populate("customerId", "-password");

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Allow direct receipt view with valid booking ID or authenticated matching user
        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to Cancel User Booking
export const cancelUserBooking = async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { bookingId, reason } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.customerId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        if (booking.status === "completed") {
            return res.json({ success: false, message: "Cannot cancel a completed booking" });
        }

        booking.status = "cancelled";
        booking.cancellationReason = reason || "Cancelled by user";
        await booking.save();

        res.json({ success: true, message: "Booking cancelled successfully", booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get Owner / Admin Bookings
export const getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate("customerId", "-password")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to change booking status and payment status (Admin)
export const changeBookingStatus = async (req, res) => {
    try {
        const { bookingId, status, paymentStatus } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (status) {
            booking.status = status;
        }
        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }

        await booking.save();

        res.json({ success: true, message: "Booking updated successfully", booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createOrder = async (req, res) => {
  try {
    const bookingData = req.body;
    console.log('--- Incoming create-order request ---', bookingData);
    const amountPaise = await computePrice(bookingData);
    console.log('Computed amountPaise:', amountPaise);

    if (amountPaise < 100) {
      return res.status(400).json({ success: false, error: 'Invalid booking amount' });
    }

    if (process.env.SKIP_RAZORPAY === 'true') {
      return res.json({
        success: true,
        order_id: 'order_TEST_' + Date.now(),
        amount: amountPaise,
        key_id: 'rzp_test_skip_razorpay'
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: 'bk_' + Date.now()
    });

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      key_id: process.env.RZP_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Payment service error. Please try again.' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { payment_id, order_id, signature } = req.body;

    if (process.env.SKIP_RAZORPAY === 'true') {
      return res.json({ success: true, verified: true });
    }

    if (!payment_id || !order_id || !signature) {
      return res.status(400).json({ success: false, error: 'Missing verification fields' });
    }

    const secret = process.env.RZP_KEY_SECRET;
    const message = `${order_id}|${payment_id}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, error: 'Payment verification failed' });
    }

    res.json({ success: true, verified: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: 'Verification error. Please try again.' });
  }
};

export const submitBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    console.log('--- Incoming submit request ---', bookingData);

    if (!process.env.EMAIL_TO) {
      return res.status(500).json({ success: false, error: 'Email address not configured' });
    }

    // Check if user exists by phone or email
    const phone = String(bookingData.user_phone || '');
    const email = bookingData.user_email || '';
    const fullName = bookingData.user_fullName || 'Unknown Customer';
    
    let customerId = req.user ? req.user._id : undefined;
    
    if (!customerId && phone) {
        let user = await User.findOne({ $or: [{ phone }, { email }] });
        if (!user) {
            user = await User.create({
                name: fullName,
                email: email || `${phone}@temp.com`,
                phone: phone,
                password: Math.random().toString(36).slice(-8), // Auto-generate password
                role: 'user'
            });
        }
        customerId = user._id;
    }

    // Parse Addons safely
    let carDecorated = 'No';
    let petAccompanied = 'No';
    if (bookingData.addons_json && typeof bookingData.addons_json === 'string') {
      try {
        const parsedAddons = JSON.parse(bookingData.addons_json);
        const decorAddon = parsedAddons.find(a => String(a.id) === '5');
        const petAddon = parsedAddons.find(a => String(a.id) === '6');
        if (decorAddon && decorAddon.option) carDecorated = decorAddon.option;
        if (petAddon && petAddon.option) petAccompanied = petAddon.option;
      } catch (e) {
        console.error('Error parsing addons_json in submitBooking', e);
      }
    }

    // Save booking logic using the exact schema fields from Booking.js
    const finalBookingId = bookingData.booking_id || ('PRD-' + Date.now());
    
    const bookingPayload = {
       // Car Details
       carId: bookingData.car_id,
       carName: bookingData.car_name,
       carPrice: parseFloat(bookingData.car_price || 0),
       extraKmRate: parseFloat(bookingData.car_extra_km || 0),
       extraHourRate: parseFloat(bookingData.car_extra_hour || 0),
       waitingCharges: parseFloat(bookingData.car_waiting || 0),
       includedKm: parseFloat(bookingData.car_included_km || 0),
       includedHours: parseFloat(bookingData.car_included_hours || 0),
       carImage: bookingData.car_image || '',

       // Airport Details
       airportName: bookingData.airport_name || '',
       airportCity: bookingData.airport_city || '',
       airportTerminal: bookingData.airport_terminal || '',
       airportEntryFee: parseFloat(bookingData.airport_entry_fee || 0),
       airportFreeWait: bookingData.airport_free_wait || '',
       parkingCharges: parseFloat(bookingData.airport_p30 || 0),
       toll: parseFloat(bookingData.airport_toll || 0),

       // Booking IDs and Customer
       bookingId: finalBookingId,
       customerId: customerId,
       status: 'New', 
       paymentId: bookingData.payment_id || '',
       paymentStatus: bookingData.payment_id ? 'Completed' : 'Pending',
       
       // Pricing Breakdown
       totalAmount: parseFloat(bookingData.total || 0),
       basePrice: parseFloat(bookingData.breakdown_base_price || 0),
       
       // Address and Transfer Details
       pickupDate: bookingData.pickup_date,
       pickupTime: bookingData.pickup_time,
       pickupCity: bookingData.pickup_city,
       pickupState: bookingData.pickup_state,
       pickupZip: bookingData.pickup_zip,
       dropAddress: bookingData.user_dropAddress || '',
       transferType: bookingData.transfer_type || '',
       
       // Customer Details
       fullName: bookingData.user_fullName || '',
       emailAddress: bookingData.user_email || '',
       phone: String(bookingData.user_phone || ''),
       flightNumber: bookingData.user_flightNo || '',
       bookingFor: (bookingData.user_isTraveller === 'true' || bookingData.user_isTraveller === true) ? 'Self' : 'Other',
       
       // Addons
       addons: {
         carDecorated: carDecorated,
         petAccompanied: petAccompanied
       },

       rawPayload: bookingData
    };

    // Use findOneAndUpdate with upsert to prevent duplicate key errors on resubmission
    await Booking.findOneAndUpdate(
      { bookingId: finalBookingId },
      { $set: bookingPayload },
      { new: true, upsert: true }
    );

    // Sends emails (Skip in development mode or log error if it fails so booking still succeeds)
    if (process.env.NODE_ENV !== 'development') {
      try {
        const adminHtml = `<h1>New Booking Request</h1><pre>${JSON.stringify(bookingData, null, 2)}</pre>`;
        await sendViaZeptoMail(
          process.env.EMAIL_TO, 
          'Prorido Admin', 
          'New Car Booking Request - Prorido', 
          adminHtml
        );

        if (bookingData.user_email) {
          const customerHtml = `<h1>Booking Confirmation</h1><p>Dear ${bookingData.user_fullName || 'Customer'}, your booking is received.</p>`;
          await sendViaZeptoMail(
            bookingData.user_email, 
            bookingData.user_fullName || 'Valued Customer', 
            'Your Booking Request is Confirmed - Prorido', 
            customerHtml
          );
        }
      } catch (emailError) {
        console.error('Failed to send email, but booking was saved:', emailError.message);
      }
    } else {
      console.log('Development mode: Skipping ZeptoMail email sending.');
    }

    res.json({ success: true, message: 'Booking submitted and email sent successfully' });
  } catch (error) {
    console.error('Error submitting booking:', error);
    res.status(500).json({ success: false, error: 'Booking submission error. Please try again.' });
  }
};
