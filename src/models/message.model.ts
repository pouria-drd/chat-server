import { Schema, model } from "mongoose";
import { IMessageDocument } from "@/types/message.types";

const messageSchema = new Schema<IMessageDocument>(
    {
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            trim: true,
            required: true,
        },

        readBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

// For performance
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });

const Message = model<IMessageDocument>("Message", messageSchema);

export default Message;
