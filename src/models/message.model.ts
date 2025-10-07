import mongoose, { Schema } from "mongoose";
import { IMessage } from "@/types/message.type";

const ALLOWED_TYPES = ["text", "image", "video", "file", "system"] as const;
const ATTACHMENT_REGEX =
    /^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp|mp4|mov|pdf|zip|docx?)$|^\/uploads\/.+\.(jpg|jpeg|png|gif|webp|mp4|mov|pdf|zip|docx?)$)/i;

const MessageSchema = new Schema<IMessage>(
    {
        // chatId: {
        //     type: Schema.Types.ObjectId,
        //     ref: "Chat",
        //     required: true,
        //     index: true,
        // },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
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
            enum: ALLOWED_TYPES,
            default: "text",
        },
        attachments: {
            type: [String],
            validate: {
                validator: (values: string[]) => values.every((v) => ATTACHMENT_REGEX.test(v)),
                message: "One or more attachments have an invalid URL format",
            },
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent",
        },
        deletedFor: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        readAt: {
            type: Date,
            default: null,
        },
        deliveredAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Compound Indexes
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

// A method to mark a message as read
MessageSchema.methods.markAsRead = async function (): Promise<void> {
    this.status = "read";
    this.readAt = new Date();
    await this.save();
};

// A method to soft delete a message for a user or all participants
MessageSchema.methods.softDeleteForUser = async function (
    userId: mongoose.Types.ObjectId,
    options?: { forAll?: boolean }
): Promise<void> {
    // Only sender can delete for all
    if (options?.forAll) {
        if (!this.sender.equals(userId)) {
            throw new Error("Only the sender can delete for everyone");
        }

        const participants: mongoose.Types.ObjectId[] = [this.sender, this.receiver].filter(
            Boolean
        ) as mongoose.Types.ObjectId[];

        this.deletedFor = participants;
        await this.save();
    } else {
        // delete just for one user
        if (!this.deletedFor.some((id: mongoose.Types.ObjectId) => id.equals(userId))) {
            this.deletedFor.push(userId);
            await this.save();
        }
    }
};

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
