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
			maxlength: 2048,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform(_, ret: Record<string, any>) {
				ret.id = ret._id?.toString();
				delete ret._id;
				return ret;
			},
		},
	},
);

// For performance
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });

const Message = model<IMessageDocument>("Message", messageSchema);

export default Message;
