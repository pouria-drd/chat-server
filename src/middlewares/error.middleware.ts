import AppError from "@/errors/app.error";
import { Request, Response, NextFunction } from "express";

const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.type,
            message: err.message,
            details: err.details,
        });
    }

    console.error("Unexpected error:", err);
    return res.status(500).json({
        success: false,
        error: "InternalError",
        message: "Something went wrong",
    });
};

export default errorMiddleware;
