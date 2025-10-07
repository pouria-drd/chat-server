import mongoose, { Schema } from "mongoose";
import { ChatType, IChat } from "@/types/chat.type";

const ChatSchema = new Schema<IChat>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            maxlength: 500,
        },

        type: {
            type: String,
            enum: Object.values(ChatType),
            required: true,
        },
        admins: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        avatar: {
            type: String,
            validate: {
                validator: (value: string) =>
                    /^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$|^\/uploads\/.+\.(jpg|jpeg|png|gif|webp)$)/i.test(
                        value
                    ),
                message: "Avatar must be a valid image URL or local upload path",
            },
        },
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },

        unreadCount: {
            type: Map,
            of: Number,
            default: new Map(),
        },
    },
    { timestamps: true }
);

ChatSchema.index({ participants: 1 });
ChatSchema.index({ type: 1, createdAt: -1 });

const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
