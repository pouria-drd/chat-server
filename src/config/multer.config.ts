import fs from "fs";
import path from "path";
import multer from "multer";
import { Request } from "express";

import ENV from "./env.config";
import logger from "./logger.config";

const AVATAR_DIR = path.join(process.cwd(), "public/uploads/avatars");

// Ensure directory exists
if (!fs.existsSync(AVATAR_DIR)) {
    fs.mkdirSync(AVATAR_DIR, { recursive: true });
}

/**
 * Multer storage configuration for user avatars
 */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${ext}`);
    },
});

/**
 * File filter to allow only image types
 */
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
        logger.error(`❌ Invalid file type: ${file.mimetype}`);
        return cb(new Error("Only JPG, PNG, WEBP, or GIFs images are allowed"));
    }
    cb(null, true);
};

/**
 * Multer instance for avatar uploads
 * - 2MB max size
 */
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: ENV.MAX_IMAGE_SIZE },
});

export default upload;
