import { z, ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest = <T extends ZodType<any, any, any>>(schema: T) => {
    return (req: Request<unknown, unknown, z.output<T>>, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err: any) {
            return res.status(400).json({
                success: false,
                errors: err.errors,
                message: "Validation failed",
            });
        }
    };
};

export default validateRequest;
