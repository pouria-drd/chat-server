import { Request, Response } from "express";

import Chat from "@/models/chat.model";
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
