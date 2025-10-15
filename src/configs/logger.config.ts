import { createLogger, format, transports, addColors } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Custom log levels and colors
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
		http: "cyan",
		debug: "magenta",
	},
};

addColors(customLevels.colors);

// Custom filter to allow only a specific level
const filterOnly = (level: string) =>
	format((info) => (info.level === level ? info : false))();

// Log format
const logFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level}] ${message}`;
});

const logger = createLogger({
	levels: customLevels.levels,
	level: "debug", // lowest level, so all logs are processed
	transports: [
		// Console: colorize only level
		new transports.Console({
			format: combine(
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				colorize({ all: false }), // only level is colorized
				logFormat,
			),
		}),

		// File transports: one file per level
		new transports.File({
			filename: "logs/error.log",
			format: combine(
				filterOnly("error"),
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				logFormat,
			),
		}),
		new transports.File({
			filename: "logs/warn.log",
			format: combine(
				filterOnly("warn"),
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				logFormat,
			),
		}),
		new transports.File({
			filename: "logs/info.log",
			format: combine(
				filterOnly("info"),
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				logFormat,
			),
		}),
		new transports.File({
			filename: "logs/http.log",
			format: combine(
				filterOnly("http"),
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				logFormat,
			),
		}),
		new transports.File({
			filename: "logs/debug.log",
			format: combine(
				filterOnly("debug"),
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				logFormat,
			),
		}),

		// Combined log: all levels
		new transports.File({
			filename: "logs/combined.log",
			format: combine(
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				logFormat,
			),
		}),
	],
});

export default logger;
