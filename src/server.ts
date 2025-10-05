import http from "http";
import app from "./app";
import ENV from "@/config/env";
import connectDB from "@/config/db";

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
            console.log(
                `✅ Server running at: http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode`
            );
        });
    } catch (error) {
        console.error("❌ Failed to start the server:", error);
        process.exit(1);
    }
};

// Run the server
startServer();
