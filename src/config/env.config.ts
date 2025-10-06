import path from "path";
import { config } from "dotenv";

// Load the correct .env file (e.g., .env.development.local)
config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}.local`),
});

type StringValue = `${number}${"s" | "m" | "h" | "d" | "y"}`;

const maxImageSize = Number(process.env.MAX_IMAGE_SIZE || 2) * 1024 * 1024;

const ENV = {
    DB_URI: process.env.DB_URI,
    MAX_IMAGE_SIZE: maxImageSize,
    PORT: Number(process.env.PORT) || 5000,
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as StringValue) || "1d",
} as const;

export default ENV;
