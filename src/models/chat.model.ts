import { IChatDocument } from "@/types";
import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema<IChatDocument>(
    {
        participants: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }],
            required: true,
            validate: {
                validator: (v: Types.ObjectId[]) => Array.isArray(v) && v.length === 2,
                message: "A conversation must have exactly two participants.",
            },
        },
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            default: null, // Will be updated as messages are sent
        },
    },
    { timestamps: true }
);

// Index for efficient lookup and to enforce uniqueness of user pairs
// Note: This unique compound index ensures that a pair of users (regardless of order)
// can only have one conversation.
chatSchema.index(
    { participants: 1 },
    { unique: true, partialFilterExpression: { "participants.1": { $exists: true } } }
);

// Pre-save hook to ensure participants array is sorted before saving
// This helps with the unique index regardless of the order users are added.
chatSchema.pre("save", function (next) {
    if (this.isModified("participants") && this.participants) {
        this.participants = this.participants.sort() as [Types.ObjectId, Types.ObjectId];
    }
    next();
});

const Chat = model<IChatDocument>("Chat", chatSchema);

export default Chat;
