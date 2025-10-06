import logger from "@/config/logger.config";
import { isAppError } from "@/errors/app.error";
import { Request, Response, NextFunction } from "express";

const errorMiddleware = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (isAppError(error)) {
        logger.error(error);
        return res.status(error.statusCode).json(error.toJSON());
    }
    // Handle unknown errors
    logger.error(error);
    res.status(500).json({
        error: {
            type: "Internal",
            message: "Internal Server Error",
        },
    });
};

export default errorMiddleware;
