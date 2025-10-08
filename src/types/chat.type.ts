import { Schema } from "mongoose";

export enum ChatType {
    GROUP = "group",
    PRIVATE = "private",
    CHANNEL = "channel",
}

export interface IChat extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    type: ChatType;
    avatar: string;
    description: string;

    owner: Schema.Types.ObjectId;
    admins: Schema.Types.ObjectId[];
    participants: Schema.Types.ObjectId[];
    participantsCount: number;

    lastMessage: Schema.Types.ObjectId;
    unreadCount: Map<string, number>;

    updatedAt: Date;
    createdAt: Date;
}

export interface Chat {
    id: string;
    name?: string;
    type: ChatType;
    avatar?: string;
    description?: string;

    owner?: string;
    admins?: string[];
    participants: string[];
    participantsCount: number;

    lastMessage?: string;
    unreadCount: { [key: string]: number };

    updatedAt: Date;
    createdAt: Date;
}
