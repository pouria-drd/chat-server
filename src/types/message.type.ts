import mongoose, { Document, Schema } from "mongoose";

/**
 * 🔹 IMessage — TypeScript interface for chat messages
 */
export interface IMessage extends Document {
    _id: Schema.Types.ObjectId;
    // chatId: Schema.Types.ObjectId; // Chat or Room reference
    sender: Schema.Types.ObjectId; // User who sent the message
    receiver?: Schema.Types.ObjectId; // Optional (for private DMs)

    content?: string;
    type: "text" | "image" | "video" | "file" | "system";
    attachments?: string[]; // URLs for media (Cloudinary/S3, etc.)

    status: "sent" | "delivered" | "read";
    deletedFor?: mongoose.Types.ObjectId[]; // IDs of users who deleted the message

    readAt?: Date;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    markAsRead(): Promise<void>;
    softDeleteForUser(
        userId: mongoose.Types.ObjectId,
        options?: { forAll?: boolean }
    ): Promise<void>;
}

/**
 * 🔹 Message DTO
 */
export interface MessageDTO {
    id: Schema.Types.ObjectId;
    chatId: Schema.Types.ObjectId; // Chat or Room reference
    sender: Schema.Types.ObjectId; // User who sent the message
    receiver?: Schema.Types.ObjectId; // Optional (for private DMs)

    content?: string;
    type: "text" | "image" | "video" | "file" | "system";
    attachments?: string[]; // URLs for media (Cloudinary/S3, etc.)

    status: "sent" | "delivered" | "read";
    deletedFor?: Schema.Types.ObjectId[]; // IDs of users who deleted the message

    readAt?: Date;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
