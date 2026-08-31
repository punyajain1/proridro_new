import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is not defined in environment");
        
        let connStr = uri.trim();
        // If URI does not specify a db name and ends with .net or .net/, append car-rental
        if (connStr.includes('.mongodb.net') && !connStr.includes('.mongodb.net/')) {
            connStr = `${connStr}/car-rental`;
        } else if (connStr.endsWith('.mongodb.net/')) {
            connStr = `${connStr}car-rental`;
        }
        
        await mongoose.connect(connStr);
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
};

export default connectDB;