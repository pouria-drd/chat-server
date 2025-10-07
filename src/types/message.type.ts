import { Schema } from "mongoose";

export enum MessageType {
    TEXT = "text",
    FILE = "file",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
}

export enum MessageStatus {
    SENT = "sent",
    READ = "read",
    DELIVERED = "delivered",
}

export interface Attachment {
    url: string;
    type: string;
    size: number;
    name: string;
}

export enum AttachmentType {
    FILE = "file",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
}

export interface IMessage extends Document {
    _id: Schema.Types.ObjectId;

    chatId: Schema.Types.ObjectId;
    senderId: Schema.Types.ObjectId;

    content?: string;
    type: MessageType;

    attachments?: Attachment[];
    replyTo?: Schema.Types.ObjectId;

    status: MessageStatus;
    readBy: Map<Schema.Types.ObjectId, Date>;
    deliveredTo: Map<Schema.Types.ObjectId, Date>;

    isEdited: boolean;
    isDeleted: boolean;
    deletedFor: Schema.Types.ObjectId[];

    updatedAt: Date;
    createdAt: Date;
}

export interface MessageDTO {
    id: string;

    chatId: string;
    senderId: string;

    content?: string;
    type: MessageType;

    attachments?: Attachment[];
    replyTo?: string;

    status: MessageStatus;
    readBy: { userId: string; date: Date }[];
    deliveredTo: { userId: string; date: Date }[];

    isEdited: boolean;
    isDeleted: boolean;
    deletedFor: string[];

    updatedAt: Date;
    createdAt: Date;
}
