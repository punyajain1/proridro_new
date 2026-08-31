import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Expect header: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ success: false, message: "not authorized" });
    }

    const token = authHeader.split(' ')[1]; // extract the raw JWT

    // Allow system-to-system proxy calls using INTERNAL_SYNC_KEY
    if (process.env.INTERNAL_SYNC_KEY && token === process.env.INTERNAL_SYNC_KEY) {
        req.user = { role: 'system' };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.json({ success: false, message: "not authorized" });
        }

        const user = await User.findById(decoded).select("-password");

        if (!user) {
            return res.json({ success: false, message: "not authorized - user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.json({ success: false, message: "not authorized" });
    }
};

export const protectOptional = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];
    
    // Allow system-to-system proxy calls using INTERNAL_SYNC_KEY
    if (process.env.INTERNAL_SYNC_KEY && token === process.env.INTERNAL_SYNC_KEY) {
        req.user = { role: 'system' };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            const user = await User.findById(decoded).select("-password");
            req.user = user || null;
        } else {
            req.user = null;
        }
    } catch (error) {
        req.user = null;
    }
    next();
};