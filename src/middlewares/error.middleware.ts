import { isAppError } from "@/errors/app.error";
import { Request, Response, NextFunction } from "express";

const errorMiddleware = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (isAppError(error)) {
        return res.status(error.statusCode).json(error.toJSON());
    }
    // Handle unknown errors
    console.error(error);
    res.status(500).json({
        error: {
            type: "Internal",
            message: "Internal Server Error",
        },
    });
};

export default errorMiddleware;
