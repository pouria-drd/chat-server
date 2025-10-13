import http from "http";
import ENV from "./env.config";
import { Server } from "socket.io";
import logger from "./logger.config";
import { protectSocket } from "@/middlewares/auth.middleware";
import { handleSocketConnection } from "@/utils/socket.utils";

function setupSocket(server: http.Server) {
    try {
        // Create a new Socket.IO server
        const io = new Server(server, {
            cors: {
                origin: ENV.CORS_ORIGIN,
                credentials: true,
            },
        });
        // Apply authentication middleware to all socket connections
        io.use(protectSocket);
        // Handle socket connection
        io.on("connection", (socket) => {
            handleSocketConnection(io, socket);
        });
        // Log the status of the Socket.IO server
        logger.info("✅ Socket.IO started successfully");
    } catch (error) {
        logger.error("❌ Failed to start Socket.IO:", error);
    }
}

export default setupSocket;
