import http from "http";
import { Server } from "socket.io";

import app from "./app.config";
import ENV from "./env.config";
import logger from "./logger.config";
import { protectSocket } from "@/middlewares/auth.middleware";
import { handleSocketConnection } from "@/utils/socket.utils";

// Create the HTTP server
const server = http.createServer(app);
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
    // Log the status of the Socket.IO server
    logger.info("✅ Socket.IO started successfully");
    handleSocketConnection(io, socket);
});

export { io, server };
