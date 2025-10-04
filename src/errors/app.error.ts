import ErrorType from "./types.error";

class AppError extends Error {
    public readonly type: ErrorType;
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(type: ErrorType, message: string, statusCode = 400, details?: any) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
