import User from "@/models/user.model";
import { Request, Response } from "express";
import { AppError } from "@/errors/app.error";
import { createUser } from "@/services/user.service";

/**
 * Register a new user
 * @param req - Express request object
 * @param res - Express response object
 */
export const register = async (req: Request, res: Response) => {
    // Get user data from request body
    const { username, email, password, firstName, lastName, gender, birthDate } = req.body;

    const _birthDate = birthDate ? new Date(birthDate) : undefined;

    // Create user via service
    const user = await createUser({
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        firstName,
        lastName,
        gender,
        birthDate: _birthDate,
    });
    // Update last login and generate token
    await user.updateLastLogin();
    const userJson = user.toJSON();
    const token = user.generateAuthToken();
    // Return user and token
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            token,
            user: userJson,
        },
    });
};

/**
 * Login a user via username or email
 * @param req - Express request object
 * @param res - Express response object
 */
export const login = async (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    // Find user by username OR email
    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    }).select("+password");
    // Check if user exists and password matches
    if (!user) throw new AppError("BadRequest", "Invalid credentialssssssssssss");
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError("BadRequest", "Invalid credentialswwwwwwwwww");

    // Check if user can login
    if (user.status === "banned") {
        throw new AppError("Forbidden", "Account is banned");
    } else if (user.status === "inactive") {
        throw new AppError("Forbidden", "Account is inactive");
    } else if (user.status === "deleted") {
        throw new AppError("Forbidden", "Account is deleted");
    } else {
        // Update last login and generate token
        await user.updateLastLogin();
        const userJson = user.toJSON();
        const token = user.generateAuthToken();
        // Return user and token
        return res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: userJson,
            },
        });
    }
};

/**
 * Check if user is authenticated
 * @param req - Express request object
 * @param res - Express response object
 */
export const checkAuth = async (req: Request, res: Response) => {
    // Check if user is authenticated
    const reqUser = req.user;
    if (!reqUser) throw new AppError("Unauthorized", "User not authenticated");
    // Find user by id
    const user = await User.findById(reqUser.id);
    if (!user) throw new AppError("NotFound", "User not found");
    const userJson = user.toJSON();
    // Return user
    return res.json({
        success: true,
        message: "User fetched successfully",
        data: {
            user: userJson,
        },
    });
};
