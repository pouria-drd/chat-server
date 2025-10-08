import mongoose from "mongoose";
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

/**
 * Send a message to a chat
 * @param req - Express request object
 * @param res - Express response object
 */
export const sendMessage = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const userId = req.user?.id;
    const { content, type, attachments, replyTo } = req.body;

    // Validate: must have text or attachments
    if (!content && (!attachments || attachments.length === 0)) {
        throw new AppError("BadRequest", "Message must have text or attachments");
    }

    // Validate: if replyTo exists, it must be a valid message ID
    if (replyTo && !mongoose.Types.ObjectId.isValid(replyTo)) {
        throw new AppError("BadRequest", "Invalid replyTo ID");
    }

    // Create new message
    const newMessage = new Message({
        chatId,
        senderId: userId,
        content,
        type,
        attachments,
        replyTo: replyTo || null,
        status: "sent",
    });

    await newMessage.save();

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id }, { new: true });

    return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: {
            message: newMessage,
        },
    });
};
