import { Types } from "mongoose";
import { BaseDocument } from "./common.types";

export interface IMessageDocument extends BaseDocument {
	chat: Types.ObjectId;

	sender: Types.ObjectId;
	receiver: Types.ObjectId;

	content: string;
}

export interface Message {
	id: string;
	chat: string;

	sender: string;
	receiver: string;

	content: string;

	updatedAt: Date;
	createdAt: Date;
}
