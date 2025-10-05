import http from "http";
import app from "./app";
import ENV from "@/config/env";
import connectDB from "@/config/db";
import logger from "@/config/logger";

// Create the HTTP server (used for both Express + Socket.IO)
const server = http.createServer(app);

// Optional: Later you’ll hook in Socket.IO here
// import { setupSocket } from "./socket";
// setupSocket(server);

/**
 * Start the server and listen for incoming connections
 */
const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Start the server only after successful DB connection
        server.listen(ENV.PORT, () => {
            logger.info(`✅ Server running at: http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`);
        });
    } catch (error) {
        logger.error("❌ Failed to start the server:", error);
        process.exit(1);
    }
};

// Run the server
startServer();
