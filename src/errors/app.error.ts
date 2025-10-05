import { ErrorStatusMap, ErrorType, IError, IErrorResponse } from "@/types/error.types";

export class AppError<T = unknown> extends Error implements IError<T> {
    public readonly type: ErrorType;
    public readonly statusCode: number;
    public readonly details?: T;

    constructor(type: ErrorType, message: string, details?: T) {
        super(message);
        this.name = "AppError";
        this.type = type;
        this.statusCode = ErrorStatusMap[type];
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): IErrorResponse<T> {
        return {
            error: {
                type: this.type,
                message: this.message,
                statusCode: this.statusCode,
                details: this.details,
            },
        };
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}
