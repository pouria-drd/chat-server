import { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";

import upload from "@/config/multer.config";
import { AppError } from "@/errors/app.error";

/**
 * Middleware to handle avatar uploads
 @param req - Express request object
 @param res - Express response object
 @param next - Express next function
 */
export const uploadAvatar = (req: Request, res: Response, next: NextFunction) => {
    const uploader = upload.single("avatar");

    uploader(req, res, (err) => {
        if (err instanceof MulterError) {
            if (err.code === "LIMIT_FILE_SIZE")
                return next(new AppError("BadRequest", "File too large"));
            return next(new AppError("BadRequest", err.message));
        } else if (err) {
            return next(new AppError("BadRequest", "Avatar upload failed"));
        }
        next();
    });
};
