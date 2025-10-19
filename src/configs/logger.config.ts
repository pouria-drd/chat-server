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
	level: "debug", // minimum level to log
	transports: [
		// Console: colorize only the level
		new transports.Console({
			format: combine(
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				colorize({ all: false }), // only level is colorized
				logFormat,
			),
		}),

		// File transports for each level
		...Object.keys(customLevels.levels).map(
			(level) =>
				new transports.File({
					filename: `logs/${level}.log`,
					format: combine(
						filterOnly(level),
						timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
						logFormat,
					),
				}),
		),

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
