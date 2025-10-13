import { Server, Socket } from "socket.io";

import { User } from "@/types";
import logger from "@/configs/logger.config";

/**
 * This is for storing online users
 */
const userSocketMap: Record<string, string> = {};

/**
 * use this function to check if the user is online or not
 * @param userId the user id to check
 * @returns the socket id of the user if online
 */
function getReceiverSocketId(userId: string) {
    return userSocketMap[userId];
}

/**
 * use this function to handle the disconnection of the user
 * @param io Socket.IO server
 * @param user the user object
 * @param userId the user id
 */
function handleDisconnect(io: Server, user: User, userId: string) {
    // Log the disconnection
    logger.info(`A user disconnected: ${user.username}`);
    // remove the user from the map
    delete userSocketMap[userId];
    // emit the event to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
}

/**
 * Handles the socket connection
 * @param io Socket.IO server
 * @param socket Socket.IO socket
 */
function handleSocketConnection(io: Server, socket: Socket) {
    // Check if the user is authenticated
    if (!socket.user) return;
    // Get the user from the socket
    const user = socket.user;
    const userId = user.id;

    // Log the connection
    logger.info(`A user connected: ${user.username}`);
    // Store the socket id and user id in a map
    userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // with socket.on we listen for events from clients
    socket.on("disconnect", () => {
        handleDisconnect(io, user, userId);
    });
}

export { getReceiverSocketId, handleSocketConnection };
