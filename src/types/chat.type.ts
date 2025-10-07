import { Schema } from "mongoose";

export enum ChatType {
    PRIVATE = "private",
    GROUP = "group",
    CHANNEL = "channel",
}

export interface IChat extends Document {
    _id: Schema.Types.ObjectId;

    owner: Schema.Types.ObjectId;

    name?: string;
    description?: string;

    type: ChatType;
    admins: Schema.Types.ObjectId[];
    participants: Schema.Types.ObjectId[];

    avatar?: string;
    lastMessage?: Schema.Types.ObjectId;

    unreadCount: Map<string, number>;

    updatedAt: Date;
    createdAt: Date;
}

export interface ChatDTO {
    id: string;
    owner: string;

    name?: string;
    description?: string;

    type: ChatType;
    admins: string[];
    participants: string[];

    avatar?: string;
    lastMessage?: string;

    unreadCount: Map<string, number>;

    updatedAt: Date;
    createdAt: Date;
}
