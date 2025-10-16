import { Request, Response } from "express";

import toUserDTO from "@/dtos/user.dto";
import User from "@/models/user.model";
import { AppError } from "@/errors/app.error";
import { CreateUserData, LoginUserData } from "@/types";
import { handleUserConflict, userExists } from "@/utils/auth.utils";

/**
 * Registers a new user.
 */
export const register = async (req: Request, res: Response) => {
	// Extract data from request body
	const data = req.body as CreateUserData;
	// Check if user exists
	const result = await userExists({
		email: data.email,
		username: data.username,
	});
	// If user exists, handle conflict
	if (result.exists) {
		const conflict = handleUserConflict(result.user, data);
		throw new AppError("Conflict", conflict.errorMessage, {
			...(conflict.username && { username: conflict.username }),
			...(conflict.email && { email: conflict.email }),
		});
	}
	// Validate birth date
	const _birthDate = data.birthDate ? new Date(data.birthDate) : undefined;
	// Create user
	const user = await User.create({
		...data,
		username: data.username.trim().toLowerCase(),
		email: data.email.trim().toLowerCase(),
		password: data.password,
		firstName: data.firstName,
		lastName: data.lastName,
		gender: data.gender,
		birthDate: _birthDate,
	});
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
	const data = req.body as LoginUserData;

	// Get full user document (with password) using the utility
	const result = await userExists({ identifier: data.identifier }, true);

	if (!result.exists || !result.fullUser) {
		throw new AppError("BadRequest", "Invalid credentials");
	}

	const user = result.fullUser;

	const isMatch = await user.comparePassword(data.password);
	if (!isMatch) {
		throw new AppError("BadRequest", "Invalid credentials");
	}

	const statusMessages: Record<string, string> = {
		banned: "Account is banned",
		inactive: "Account is inactive",
		deleted: "Account is deleted",
	};

	if (statusMessages[user.status]) {
		throw new AppError("Forbidden", statusMessages[user.status]);
	}

	// Update last login and generate token
	await user.updateLastLogin();
	const token = user.generateAuthToken();
	const userDTO = toUserDTO(user);
	// Return user dto and token
	return res.json({
		success: true,
		message: "Login successful",
		data: { token, user },
	});
};
