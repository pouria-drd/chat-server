import { config } from "dotenv";
import path from "path";

// Load the correct .env file (e.g., .env.development.local)
config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}.local`),
});

// Define and validate environment variables
const requiredEnv = ["PORT", "NODE_ENV"] as const;

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
}

export const ENV = {
    PORT: Number(process.env.PORT) || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
} as const;
