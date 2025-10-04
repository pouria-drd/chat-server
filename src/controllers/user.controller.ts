import userDto from "@/dtos/user.dto";
import User from "@/models/user.model";
import AppError from "@/errors/app.error";
import ErrorType from "@/errors/types.error";
import { Request, Response } from "express";

/**
 * Get authenticated user
 * @param req - Express request object
 * @param res - Express response object
 */
const getAuthUser = async (req: Request, res: Response) => {
    // Check if user is authenticated
    const reqUser = req.user;
    if (!reqUser) throw new AppError(ErrorType.Unauthorized, "Unauthorized", 401);
    // Find user by id
    const user = await User.findById(reqUser.id);
    if (!user) throw new AppError(ErrorType.NotFound, "User not found", 404);

    return res.json({
        success: true,
        message: "User fetched successfully",
        data: {
            user: userDto(user),
        },
    });
};

export default getAuthUser;
