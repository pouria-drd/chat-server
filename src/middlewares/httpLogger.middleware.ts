import logger from "@/configs/logger.config";
import morgan, { StreamOptions } from "morgan";

// Custom stream for Morgan to use Winston instead of console
const stream: StreamOptions = {
	write: (message) => logger.http(message.trim()),
};

// Skip logging for health checks or specific routes (optional)
const skip = () => {
	return process.env.NODE_ENV === "test";
};

// Define custom log format similar to Django
// Example Output: 127.0.0.1 - GET /api/users 200 12ms
const format = ":method | :url | :status | :response-time ms | :remote-addr";

// Create and export the middleware
const httpLogger = morgan(format, { stream, skip });

export default httpLogger;
