import path from "path";
import { config } from "dotenv";

// Load the correct .env file (e.g., .env.development.local)
config({
	path: path.resolve(
		process.cwd(),
		`.env.${process.env.NODE_ENV || "development"}.local`,
	),
});

type StringValue = `${number}${"s" | "m" | "h" | "d" | "y"}`;

const jsonLimit = process.env.JSON_LIMIT || "2mb";
const maxImageSize = Number(process.env.MAX_IMAGE_SIZE || 2) * 1024 * 1024;

const corsOrigin = process.env.CORS_ORIGIN?.split(",");

const ENV = {
	// Uploads
	JSON_LIMIT: jsonLimit,
	MAX_IMAGE_SIZE: maxImageSize,

	// Server
	DB_URI: process.env.DB_URI,
	PORT: Number(process.env.PORT) || 5000,
	NODE_ENV: process.env.NODE_ENV || "development",

	// Cors
	CORS_ORIGIN: corsOrigin || "*",

	// JWT
	JWT_SECRET: process.env.JWT_SECRET || "secret",
	JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as StringValue) || "1d",

	// ArcJet
	ARCJET_MAX: Number(process.env.ARCJET_MAX) || 100,
	ARCJET_INTERVAL: (process.env.ARCJET_INTERVAL as StringValue) || "1m",
	ARCJET_KEY: process.env.ARCJET_KEY,
	ARCJET_ENV: process.env.ARCJET_ENV || "development",

	// Cloudinary
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
} as const;

export default ENV;
