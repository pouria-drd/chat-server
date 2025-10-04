import userDto from "@/dtos/user.dto";
import User from "@/models/user.model";
import AppError from "@/errors/app.error";
import { Request, Response } from "express";
import ErrorType from "@/errors/types.error";
import createUser from "@/services/user.service";

export const register = async (req: Request, res: Response) => {
    const { username, email, password, firstName, lastName, gender, birthDate } = req.body;

    const user = await createUser({
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        firstName,
        lastName,
        gender,
        birthDate,
    });

    user.updateLastLogin();
    const token = user.generateAuthToken();

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            token,
            user: userDto(user),
        },
    });
};

export const login = async (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    // Find user by username OR email
    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) throw new AppError(ErrorType.Unauthorized, "Invalid credentials", 401);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError(ErrorType.Unauthorized, "Invalid credentials", 401);

    const token = user.generateAuthToken();
    return res.json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user: userDto(user),
        },
    });
};
