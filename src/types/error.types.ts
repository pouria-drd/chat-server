// src/types/error.types.ts

export const ErrorType = {
    BadRequest: "BadRequest",
    Unauthorized: "Unauthorized",
    Forbidden: "Forbidden",
    NotFound: "NotFound",
    Conflict: "Conflict",
    Internal: "Internal",
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

export const ErrorStatusMap: Record<ErrorType, number> = {
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    Conflict: 409,
    Internal: 500,
};

export interface IError<T = unknown> {
    type: ErrorType;
    message: string;
    statusCode: number;
    details?: T;
}

export interface IErrorResponse<T = unknown> {
    error: IError<T>;
}
