import { Request, Response, NextFunction } from "express";

import Chat from "@/models/chat.model";
import { AppError } from "@/errors/app.error";

export const chatAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chatId } = req.params;
        const userId = req.user?.id;

        if (!chatId) {
            throw new AppError("BadRequest", "Chat ID is required");
        }

        const chat = await Chat.findById(chatId).select("participants owner admins");

        if (!chat) {
            throw new AppError("NotFound", "Chat not found");
        }

        // Check if user is participant, admin, or owner
        const isParticipant = chat.participants.some((p) => p.toString() === userId);
        const isAdmin = chat.admins?.some((a) => a.toString() === userId);
        const isOwner = chat.owner?.toString() === userId;

        if (!isParticipant && !isAdmin && !isOwner) {
            throw new AppError("Forbidden", "You are not allowed to access this chat");
        }

        next();
    } catch (error) {
        throw new AppError("Internal", "Internal server error");
    }
};
