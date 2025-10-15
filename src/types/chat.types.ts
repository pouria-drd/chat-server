import { Types } from "mongoose";
import { BaseDocument } from "./common.types";

export interface IChatDocument extends BaseDocument {
	participants: Types.ObjectId[]; // exactly two users
	lastMessage?: Types.ObjectId;
}

export interface Chat {
	id: string;

	participants: string[];
	lastMessage?: string;

	updatedAt: Date;
	createdAt: Date;
}
