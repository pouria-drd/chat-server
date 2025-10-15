import toUserDTO from "@/dtos/user.dto";
import { Request, Response } from "express";
import { createUser, loginUser } from "@/services/auth.service";

/**
 * Registers a new user.
 */
export const register = async (req: Request, res: Response) => {
	// Create user via service
	const user = await createUser(req.body);
	// Update last login and generate token
	await user.updateLastLogin();
	const token = user.generateAuthToken();
	// Return user dto and token
	const userDTO = toUserDTO(user);
	return res.status(201).json({
		success: true,
		message: "User registered successfully",
		data: { token, user: userDTO },
	});
};

/**
 * Logs in an existing user.
 */
export const login = async (req: Request, res: Response) => {
	// Authenticate user via service
	const { user, token } = await loginUser(req.body);
	// Return user dto and token
	const userDTO = toUserDTO(user);
	return res.json({
		success: true,
		message: "Login successful",
		data: { token, user: userDTO },
	});
};
