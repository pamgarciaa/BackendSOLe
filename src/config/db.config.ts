import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error("La variable de entorno MONGO_URI no está definida");
        }

        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection error:", error);
        process.exit(1);
    }
};

export default connectDB;