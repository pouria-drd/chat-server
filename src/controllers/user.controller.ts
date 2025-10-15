import toUserDTO from "@/dtos/user.dto";
import { Request, Response } from "express";
import { AppError } from "@/errors/app.error";
import { deleteFile } from "@/utils/file.utils";

/**
 * Get user from request
 * @param req - Express request object
 * @param res - Express response object
 */
export const getUser = async (req: Request, res: Response) => {
    // Check if user is authenticated
    const reqUser = req.user;
    if (!reqUser) throw new AppError("Unauthorized", "User not authenticated");

    const userDTO = toUserDTO(reqUser);

    // Return user
    return res.json({
        success: true,
        message: "User fetched successfully",
        data: {
            user: userDTO,
        },
    });
};

/**
 * Handles user avatar upload
 * Updates user record and deletes old avatar if exists
 */
export const uploadUserAvatar = async (req: Request, res: Response) => {
    // Check if file was uploaded and is valid
    if (!req.file) throw new AppError("BadRequest", "No file uploaded");
    // Check if user is authenticated
    const user = req.user;
    if (!user) throw new AppError("NotFound", "User not found");

    // Delete old avatar
    await deleteFile(user.avatar);

    // Save new avatar
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    // Return updated user

    const userDTO = toUserDTO(user);

    return res.json({
        success: true,
        message: "Avatar updated successfully",
        data: {
            user: userDTO,
        },
    });
};
