import { createLogger, format, transports, addColors } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Define custom colors for levels
const customLevels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		debug: 4,
	},
	colors: {
		error: "red",
		warn: "yellow",
		info: "green",
		http: "cyan", //blue
		debug: "magenta",
	},
};

addColors(customLevels.colors);

const logFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level}] ${message}`;
});

const logger = createLogger({
	levels: customLevels.levels,
	level: "http", // log all levels above http
	format: combine(
		colorize(),
		timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		logFormat,
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: "logs/error.log", level: "error" }),
		new transports.File({ filename: "logs/info.log", level: "info" }),
		new transports.File({ filename: "logs/http.log", level: "http" }),
		new transports.File({ filename: "logs/debug.log", level: "debug" }),
		new transports.File({ filename: "logs/warn.log", level: "warn" }),
		new transports.File({ filename: "logs/combined.log" }),
	],
});

export default logger;
