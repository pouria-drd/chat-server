import mongoose, { Schema } from "mongoose";
import { ChatType, IChat } from "@/types/chat.type";

const ChatSchema = new Schema<IChat>(
    {
        name: {
            trim: true,
            type: String,
        },
        type: {
            type: String,
            default: ChatType.PRIVATE,
            enum: Object.values(ChatType),
        },
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
        description: {
            type: String,
            maxlength: 500,
        },

        owner: {
            ref: "User",
            type: Schema.Types.ObjectId,
            required: function (this: IChat) {
                return this.type === ChatType.GROUP;
            },
        },
        admins: [
            {
                ref: "User",
                unique: true,
                type: Schema.Types.ObjectId,
            },
        ],
        participants: [
            {
                ref: "User",
                unique: true,
                required: true,
                type: Schema.Types.ObjectId,
            },
        ],

        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
        unreadCount: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    { timestamps: true }
);

ChatSchema.index({ type: 1, createdAt: -1 });
ChatSchema.index({ participants: 1, updatedAt: -1 });

ChatSchema.virtual("participantsCount").get(function () {
    return this.participants?.length || 0;
});

const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
