import path from "path";
import { config } from "dotenv";

// Load the correct .env file (e.g., .env.development.local)
config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}.local`),
});

type StringValue = `${number}${"s" | "m" | "h" | "d" | "y"}`;

export const ENV = {
    PORT: Number(process.env.PORT) || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as StringValue) || "1d",
} as const;
