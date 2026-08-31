import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import dataRouter from "./routes/dataRoutes.js";

// Initialize Express App
const app = express();
app.set('trust proxy', 1);

// Connect Database
await connectDB();

// Middleware
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

// API Routes
app.get('/', (req, res) => res.json({ success: true, message: "Proridro API Server is operational" }));
app.use('/api', dataRouter);
app.use('/api/user', userRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proridro Server running on port ${PORT}`));