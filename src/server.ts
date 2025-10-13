import ENV from "@/configs/env.config";
import connectDB from "@/configs/db.config";
import logger from "@/configs/logger.config";
import { server } from "@/configs/socket.config";

/**
 * Start the server and listen for incoming connections
 */
const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Start the server only after successful DB connection
        server.listen(ENV.PORT, async () => {
            logger.info(`✅ Server running at: http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`);
        });
    } catch (error) {
        logger.error("❌ Failed to start the server:", error);
        process.exit(1);
    }
};

// Run the server
startServer();
