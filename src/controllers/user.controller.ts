import User from "@/models/user.model";
import { userDto } from "@/dtos/user.dto";
import { Request, Response } from "express";
import { AppError } from "@/errors/app.error";

/**
 * Get authenticated user
 * @param req - Express request object
 * @param res - Express response object
 */
const getAuthUser = async (req: Request, res: Response) => {
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

export default getAuthUser;
