import mongoose, { Schema } from "mongoose";
import { AttachmentType, IMessage, MessageStatus, MessageType } from "@/types/message.type";

const MessageSchema = new Schema<IMessage>(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            trim: true,
            required: function (this: IMessage) {
                return this.type === "text" || !this.attachments?.length;
            },
        },
        type: {
            type: String,
            enum: Object.values(MessageType),
            default: MessageType.TEXT,
        },

        attachments: [
            {
                url: {
                    type: String,
                    validate: {
                        validator: (value: string) =>
                            /^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp|mp4|mov|pdf|zip|docx?)$|^\/uploads\/.+\.(jpg|jpeg|png|gif|webp|mp4|mov|pdf|zip|docx?)$)/i.test(
                                value
                            ),
                        message: "One or more attachments have an invalid URL format",
                    },
                },
                type: {
                    type: String,
                    enum: Object.values(AttachmentType),
                    required: true,
                },
                size: {
                    type: Number,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
            },
        ],
        replyTo: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },

        status: {
            type: String,
            enum: Object.values(MessageStatus),
            default: MessageStatus.SENT,
        },
        readBy: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User" },
                date: { type: Date, default: null },
            },
        ],
        deliveredTo: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User" },
                date: { type: Date, default: null },
            },
        ],

        isEdited: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedFor: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
