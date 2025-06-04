import mongoose from "mongoose";
// Uses mongoose to connect to our database
export const connectDB = async (params) => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error.", error);
    }
};