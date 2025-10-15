import { Document, Schema } from "mongoose";

interface BaseDocument extends Document {
	_id: Schema.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export { BaseDocument };
