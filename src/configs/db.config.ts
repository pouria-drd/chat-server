import ENV from "./env.config";
import logger from "./logger.config";
import mongoose from "mongoose";

/**
 * Connect to MongoDB using Mongoose
 */
const connectDB = async (): Promise<void> => {
	try {
		if (!ENV.DB_URI) {
			throw new Error(
				"Please define the DB_URI environment variable inside your .env.<environment>.local file",
			);
		}
		await mongoose.connect(ENV.DB_URI);
		logger.info(`✅ Connected to MongoDB (${ENV.NODE_ENV})`);
	} catch (error) {
		logger.error("❌ Error connecting to MongoDB:", error);
		process.exit(1);
	}
};

// Optional: handle connection events (for debugging or logs)
mongoose.connection.on("disconnected", () => {
	logger.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
	logger.info("🔄 MongoDB reconnected");
});

export default connectDB;
