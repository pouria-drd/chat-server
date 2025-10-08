import { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";

import upload from "@/configs/multer.config";
import { AppError } from "@/errors/app.error";

/**
 * Middleware to handle avatar uploads
 @param req - Express request object
 @param res - Express response object
 @param next - Express next function
 */
export const uploadAvatar = (req: Request, res: Response, next: NextFunction) => {
    try {
        const uploader = upload.single("avatar");

        uploader(req, res, (err) => {
            if (err instanceof MulterError) {
                if (err.code === "LIMIT_FILE_SIZE")
                    throw new AppError("BadRequest", "File too large");
                throw new AppError("BadRequest", err.message);
            } else if (err) {
                throw new AppError("BadRequest", "Avatar upload failed");
            }
            next();
        });
    } catch (error) {
        throw new AppError("Internal", "Internal server error");
    }
};
