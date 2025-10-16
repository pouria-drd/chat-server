import { Request, Response } from "express";

import Chat from "@/models/chat.model";
import { io } from "@/configs/socket.config";
import Message from "@/models/message.model";
import { AppError } from "@/errors/app.error";
import { sendResponse } from "@/utils/app.utils";
import { getReceiverSocketId } from "@/utils/socket.utils";

/**
 * Get all Chats for the authenticated user
 * GET /api/v1/chats
 */
const getUserChats = async (req: Request, res: Response) => {
	// Check if user is authenticated
	const userId = req.user?.id;
	if (!userId) {
		throw new AppError("Unauthorized", "User not authenticated");
	}
	// Get all chats for the user
	const chats = await Chat.find({ participants: userId })
		.populate(
			"participants",
			"username avatar firstName lastName isOnline lastSeen",
		)
		.populate({
			path: "lastMessage",
			select: "content sender receiver createdAt",
			populate: {
				path: "sender receiver",
				select: "username avatar firstName lastName isOnline lastSeen",
			},
		})
		.sort({ updatedAt: -1 });

	sendResponse(res, 200, "Chats fetched successfully", {
		chats,
	});
};

/**
 * @desc Create a new chat (if one doesn't exist)
 * @route POST /api/v1/chats
 * @body { recipientId: string }
 */
const createChat = async (req: Request, res: Response) => {
	// Check if user is authenticated
	const userId = req.user?.id;
	if (!userId) {
		throw new AppError("Unauthorized", "User not authenticated");
	}
	// Check if recipient ID exists in the request body
	const { recipientId } = req.body;
	if (!recipientId)
		throw new AppError("BadRequest", "Recipient ID is required");
	// Check if user is the recipient
	// if (recipientId.toString() === userId.toString()) {
	//     throw new AppError("BadRequest", "You cannot create a chat with yourself");
	// }

	const participants = [userId, recipientId].sort();

	let statusCode = 200;

	let chat = await Chat.findOne({ participants });
	if (!chat) {
		statusCode = 201;
		chat = await Chat.create({ participants });
	}

	const populated = await chat.populate(
		"participants",
		"username avatar firstName lastName isOnline lastSeen",
	);

	sendResponse(res, statusCode, "Chat created successfully", {
		chat: populated,
	});
};

/**
 * @desc Get messages for a specific chat
 * @route GET /api/v1/chats/:chatId/messages
 */
const getChatMessages = async (req: Request, res: Response) => {
	// Check if user is authenticated
	const userId = req.user?.id;
	if (!userId) {
		throw new AppError("Unauthorized", "User not authenticated");
	}
	// Check if chat ID exists in the request params
	const { chatId } = req.params;
	const chat = await Chat.findById(chatId);
	if (!chat) {
		throw new AppError("NotFound", "Chat not found");
	}
	// Check if user is part of the chat
	if (!chat.participants.some((p) => p.toString() === userId.toString())) {
		throw new AppError("Forbidden", "You are not part of this chat");
	}

	const messages = await Message.find({ chat: chatId })
		.sort({ createdAt: 1 })
		.populate("sender", "username avatar fullName isOnline lastSeen")
		.populate("receiver", "username avatar fullName isOnline lastSeen");

	sendResponse(res, 200, "Messages fetched successfully", {
		messages,
		totalMessages: messages.length,
	});
};

/**
 * @desc Send a message in a chat
 * @route POST /api/v1/chats/:chatId/messages
 * @body { content: string }
 */
const sendMessage = async (req: Request, res: Response) => {
	// Check if user is authenticated
	const userId = req.user?.id;
	if (!userId) {
		throw new AppError("Unauthorized", "User not authenticated");
	}
	// Check if content is provided in the request body
	const { content } = req.body;
	if (!content) {
		throw new AppError("BadRequest", "Message content is required");
	}
	// Check if chat exists
	const { chatId } = req.params;
	const chat = await Chat.findById(chatId);
	if (!chat) {
		throw new AppError("NotFound", "Chat not found");
	}
	// Check if user is part of the chat
	if (!chat.participants.some((p) => p.toString() === userId.toString())) {
		throw new AppError("Forbidden", "You are not part of this chat");
	}
	// Get the receiver id from the chat participants
	const receiverId = chat.participants.find(
		(p) => p.toString() !== userId.toString(),
	)!;
	// Create a new message
	const message = await Message.create({
		chat: chatId,
		sender: userId,
		receiver: receiverId,
		content,
	});
	// Update the chat lastMessage
	chat.lastMessage = message.id;
	await chat.save();
	// Populate the message with sender and receiver data
	const populated = await message.populate([
		{
			path: "sender",
			select: "username avatar firstName lastName isOnline lastSeen",
		},
		{
			path: "receiver",
			select: "username avatar firstName lastName isOnline lastSeen",
		},
	]);
	// Send the message to the receiver via socket
	const receiverSocketId = getReceiverSocketId(receiverId.toString());
	if (receiverSocketId) {
		io.to(receiverSocketId).emit("onNewMessage", populated);
	}
	// Send the response
	sendResponse(res, 201, "Message sent successfully", {
		message: populated,
	});
};

/**
 * @desc Mark all messages in a chat as read by the current user
 * @route POST /api/v1/chats/:chatId/read
 */
const markMessagesAsRead = async (req: Request, res: Response) => {
	// Check if user is authenticated
	const userId = req.user?.id;
	if (!userId) {
		throw new AppError("Unauthorized", "User not authenticated");
	}
	// Check if chat exists
	const { chatId } = req.params;
	const chat = await Chat.findById(chatId);
	if (!chat) {
		throw new AppError("NotFound", "Chat not found");
	}
	// Check if user is part of the chat
	if (!chat.participants.some((p) => p.toString() === userId.toString())) {
		throw new AppError("Forbidden", "You are not part of this chat");
	}

	await Message.updateMany(
		{ chat: chatId, receiver: userId, read: false },
		{ $set: { read: true } },
	);

	sendResponse(res, 200, "Messages marked as read successfully");
};

export {
	createChat,
	getChatMessages,
	getUserChats,
	sendMessage,
	markMessagesAsRead,
};
