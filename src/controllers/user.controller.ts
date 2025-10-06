import User from "@/models/user.model";
import { userDto } from "@/dtos/user.dto";
import { Request, Response } from "express";
import { AppError } from "@/errors/app.error";
import { deleteFile } from "@/utils/file.util";
import cloudinary from "@/config/cloudinary.config";

/**
 * Get authenticated user
 */
export const getAuthUser = async (req: Request, res: Response) => {
    // Check if user is authenticated
    const reqUser = req.user;
    if (!reqUser) throw new AppError("Unauthorized", "User not authenticated");
    // Find user by id
    const user = await User.findById(reqUser.id);
    if (!user) throw new AppError("NotFound", "User not found");
    // Convert user to DTO
    const _userDto = userDto(user);
    // Return user
    return res.json({
        success: true,
        message: "User fetched successfully",
        data: {
            user: _userDto,
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
    const _userDto = userDto(user);

    return res.json({
        success: true,
        message: "Avatar updated successfully",
        data: { user: _userDto },
    });
};

/**
 * Handles user avatar upload via cloudinary
 * Updates user record and deletes old avatar if exists
 */
export const cloudinaryUpdateUserAvatar = async (req: Request, res: Response) => {
    // Check if avatar is available
    const { avatar } = req.body;
    if (!avatar) throw new AppError("BadRequest", "Avatar is required");
    // Check if user is authenticated and exists
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) throw new AppError("NotFound", "User not found");

    const uploadResponse = await cloudinary.uploader.upload(avatar);

    // Delete old avatar
    await deleteFile(user.avatar);

    // Save new avatar
    user.avatar = uploadResponse.secure_url;
    await user.save();

    // Return updated user
    const _userDto = userDto(user);

    return res.json({
        success: true,
        message: "Avatar updated successfully",
        data: { user: _userDto },
    });
};
