import Chat from "@/models/chat.model";
import { Request, Response } from "express";

/**
 * Get chats that this user participates in
 * @param req - Express request object
 * @param res - Express response object
 */
export const getUserChats = async (req: Request, res: Response) => {
    const userId = req.user?.id;

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
