import User from '../models/User.js';
import Booking from '../models/Booking.js';

export const syncBooking = async (req, res) => {
    try {
        console.log('--- Incoming sync request ---', req.body);
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== process.env.INTERNAL_SYNC_KEY) {
            return res.status(401).json({ success: false, message: 'Unauthorized sync attempt' });
        }

        const payload = req.body;
        
        // Extract fields according to mapping
        const bookingId = payload.booking_id;
        const phone = payload.user?.phone;
        const fullName = payload.user?.fullName || payload.user?.fullName;
        const email = payload.user?.email;
        const pickupDate = payload.pickup?.date;
        const pickupTime = payload.pickup?.time;
        const amount = payload.total;
        
        // The service type could be transfer_type
        const serviceType = payload.transfer_type || payload.serviceType || 'unknown';

        if (!bookingId || !phone) {
            return res.status(400).json({ success: false, message: 'Missing required fields: booking_id or phone' });
        }

        // Check if booking already exists
        const existingBooking = await Booking.findOne({ bookingId });
        if (existingBooking) {
            return res.status(409).json({ success: false, message: 'Booking ID already exists' });
        }

        // Check if user exists
        let user = await User.findOne({ phone });

        if (!user) {
            // Create new user
            user = await User.create({
                name: fullName || 'Unknown',
                email: email || `${phone}@temp.com`, // email is required in Schema, provide fallback
                phone: phone,
                password: Math.random().toString(36).slice(-8), // Generate a random password since it's required
                role: 'user'
            });
        }

        // Create booking mapped to existing Mongoose Booking schema
        const booking = await Booking.create({
            bookingId: bookingId,
            customerId: user._id,
            fullName: user.name,
            emailAddress: user.email,
            phone: user.phone,
            transferType: serviceType,
            totalAmount: amount ? Number(amount) : 0,
            pickupDate: pickupDate,
            pickupTime: pickupTime,
            status: "New", // Default enum in schema
            rawPayload: payload // Saving the complete payload for future use
        });

        return res.status(200).json({
            success: true,
            message: 'Booking synchronized successfully',
            data: { booking_id: booking.bookingId, internal_id: booking._id }
        });

    } catch (error) {
        console.error('Error synchronizing booking:', error);
        
        if (error.code === 11000) { 
            // Mongo Duplicate Key Error
            return res.status(409).json({ success: false, message: 'Booking ID already exists' });
        }

        return res.status(500).json({ success: false, message: 'Internal server error during sync' });
    }
};
