import { Request, Response, NextFunction } from "express";

// Create a custom error type for stronger typing
interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    errors?: Record<string, { message: string }>;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error("❌ Error Middleware:", err);

    // Use the original error status/message if available
    const statusCode = err.statusCode || err.code || 500;
    let message = err.message || "Internal Server Error";

    // Handle specific Mongoose errors
    if (err.name === "CastError") {
        return res.status(404).json({
            success: false,
            message: "Resource not found",
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate field value entered",
        });
    }

    if (err.name === "ValidationError" && err.errors) {
        const messages = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", "),
        });
    }

    // Default response
    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;
