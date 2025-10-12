import User from "@/models/user.model";
import { Request, Response } from "express";
import { AppError } from "@/errors/app.error";
import { deleteFile } from "@/utils/file.utils";

/**
 * Handles user avatar upload
 * Updates user record and deletes old avatar if exists
 */
export const uploadUserAvatar = async (req: Request, res: Response) => {
    // Check if file was uploaded and is valid
    if (!req.file) throw new AppError("BadRequest", "No file uploaded");
    // Check if user is authenticated and exists
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) throw new AppError("NotFound", "User not found");

    // Delete old avatar
    await deleteFile(user.avatar);

    // Save new avatar
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    // Return updated user
    const userJson = user.toJSON();

    return res.json({
        success: true,
        message: "Avatar updated successfully",
        data: {
            user: userJson,
        },
    });
};
