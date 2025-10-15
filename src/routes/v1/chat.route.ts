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

chatRouter.use(protect);

/**
 * @route GET /api/v1/chats
 * @desc Get all chats for the authenticated user
 */
chatRouter.get("/", asyncHandler(getUserChats));

/**
 * @route POST /api/v1/chats
 * @desc Create a new chat (if one doesn't exist)
 */
chatRouter.post("/", asyncHandler(createChat)); // body: { recipientId: string }

/**
 * @route GET /api/v1/chats/:chadId
 * @desc Get messages for a specific chat
 */
chatRouter.get("/:chadId/messages", asyncHandler(getChatMessages));

/**
 * @route POST /api/v1/chats/:chadId/messages
 * @desc Send a message within a chat
 */
chatRouter.post("/:chadId/messages", asyncHandler(sendMessage)); // body: { content: string }

/**
 * @route POST /api/v1/chats/:chadId/read
 * @desc Mark messages in a chat as read by the current user
 */
chatRouter.post("/:chadId/read", asyncHandler(markMessagesAsRead));

export default chatRouter;
