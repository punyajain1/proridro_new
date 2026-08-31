import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    // Car details
    carId: { type: String, default: "" },
    carName: { type: String, default: "" },
    carPrice: { type: Number, default: 0 },
    extraKmRate: { type: Number, default: 0 },
    extraHourRate: { type: Number, default: 0 },
    waitingCharges: { type: Number, default: 0 },
    includedKm: { type: Number, default: 0 },
    includedHours: { type: Number, default: 0 },
    carImage: { type: String, default: "" },

    // Airport details
    airportName: { type: String, default: "" },
    airportCity: { type: String, default: "" },
    airportTerminal: { type: String, default: "" },
    airportEntryFee: { type: Number, default: 0 },
    airportFreeWait: { type: String, default: "" },
    parkingCharges: { type: Number, default: 0 },
    toll: { type: Number, default: 0 },

    // Transfer & Address details
    transferType: { type: String, default: "" },
    dropAddress: { type: String, default: "" },
    pickupCity: { type: String, default: "" },
    pickupState: { type: String, default: "" },
    pickupZip: { type: String, default: "" },
    pickupDate: { type: String, default: "" },
    pickupTime: { type: String, default: "" },

    // Customer details
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fullName: { type: String, default: "" },
    emailAddress: { type: String, default: "" },
    phone: { type: String, default: "" },
    flightNumber: { type: String, default: "" },
    bookingFor: { type: String, default: "Self" },

    // Add-ons
    addons: {
        carDecorated: { type: String, default: "No" },
        petAccompanied: { type: String, default: "No" }
    },

    // Booking & Payment identifiers
    bookingId: { type: String, required: true, unique: true },
    paymentId: { type: String, default: "" },
    paymentStatus: { type: String, default: "Pending" },
    status: {
        type: String,
        enum: ["New", "Confirmed", "Completed", "Cancelled"],
        default: "New"
    },

    // Pricing Breakdown
    basePrice: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    // Apps Script Sync Payload
    rawPayload: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;