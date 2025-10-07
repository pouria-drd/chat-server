import aj from "@/configs/arcjet.config";
// import logger from "@/config/logger.config";
import { AppError } from "@/errors/app.error";
import { isSpoofedBot } from "@arcjet/inspect";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle ArcJet requests
 * Checks if the request is a bot and blocks it if it is
 * @param req - Express request object
 * @param res - Express response object
 */
const ajProtect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Protect the request with ArcJet
        const decision = await aj.protect(req);
        // Check if request is blocked
        if (decision.isDenied()) {
            // Rate limit
            if (decision.reason.isRateLimit()) {
                throw new AppError("TooManyRequests", "You have exceeded the rate limit");
            }
            // Bot
            else if (decision.reason.isBot()) {
                throw new AppError("Forbidden", "Bot access denied");
            }
            // Other
            else {
                throw new AppError("Forbidden", "Access denied by security policy");
            }
        }
        // Check for spoofed bot
        if (decision.results.some(isSpoofedBot)) {
            throw new AppError("Forbidden", "Bot access denied");
        }
        // Check if request is allowed can continue
        if (decision.isAllowed()) {
            next();
        }
    } catch (error) {
        // logger.error("❌ ArcJet middleware error:", error);
        next(error);
    }
};

export default ajProtect;
