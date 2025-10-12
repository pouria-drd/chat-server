import { z, ZodError, ZodType } from "zod";
import { AppError } from "@/errors/app.error";
import { Request, Response, NextFunction } from "express";

function validateRequest<T extends ZodType<any, any, any>>(schema: T) {
    return (req: Request<unknown, unknown, z.output<T>>, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const errors: Record<string, string[]> = {};

                for (const issue of err.issues) {
                    const key = issue.path.join(".") || "general";
                    if (!errors[key]) errors[key] = [];
                    errors[key].push(issue.message);
                }

                throw new AppError("BadRequest", "Validation failed", errors);
            }

            throw new AppError("Internal", "Unexpected validation error");
        }
    };
}

export default validateRequest;
