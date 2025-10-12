import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware";
import asyncHandler from "@/middlewares/asyncHandler.middleware";
import {
    createChat,
    getChatMessages,
    getUserChats,
    markMessagesAsRead,
    sendMessage,
} from "@/controllers/chat.controller";

const chatRouter = Router();

/**
 * @route GET /api/v1/chats
 * @desc Get all chats for the authenticated user
 */
chatRouter.get("/", protect, asyncHandler(getUserChats));

/**
 * @route POST /api/v1/chats
 * @desc Create a new chat (if one doesn't exist)
 */
chatRouter.post("/", protect, asyncHandler(createChat)); // body: { recipientId: string }

/**
 * @route GET /api/v1/chats/:chadId
 * @desc Get messages for a specific chat
 */
chatRouter.get("/:chadId/messages", protect, asyncHandler(getChatMessages));

/**
 * @route POST /api/v1/chats/:chadId/messages
 * @desc Send a message within a chat
 */
chatRouter.post("/:chadId/messages", protect, asyncHandler(sendMessage)); // body: { content: string }

/**
 * @route POST /api/v1/chats/:chadId/read
 * @desc Mark messages in a chat as read by the current user
 */
chatRouter.post("/:chadId/read", protect, asyncHandler(markMessagesAsRead));

export default chatRouter;
