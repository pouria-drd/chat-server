import { Request, Response } from "express";

import Chat from "@/models/chat.model";
import Message from "@/models/message.model";
import { AppError } from "@/errors/app.error";

/**
 * Get chats that this user participates in
 * @param req - Express request object
 * @param res - Express response object
 */
export const getUserChats = async (req: Request, res: Response) => {
    // check if user is authenticated
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", "User not authenticated");
    // find chats that this user participates in
    const chats = await Chat.find({
        participants: userId,
    })
        .populate("participants", "id username avatar isOnline")
        .populate("lastMessage")
        .sort({ updatedAt: -1 }); // recent chats first

    return res.status(200).json({
        success: true,
        count: chats.length,
        data: chats,
    });
};

/**
 * Get chat messages
 * @param req - Express request object
 * @param res - Express response object
 */
export const getChatMessages = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const page = parseInt(req.query.page as string) || 1; // page number
    const limit = parseInt(req.query.limit as string) || 20; // messages per page

    const messages = await Message.find({ chatId })
        .populate("senderId", "id username avatar isOnline lastSeen") // sender info
        .populate("replyTo")
        .sort({ createdAt: -1 }) // newest first
        .skip((page - 1) * limit)
        .limit(limit);

    const totalMessages = await Message.countDocuments({ chatId });

    return res.status(200).json({
        success: true,
        page,
        limit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        messages,
    });
};
