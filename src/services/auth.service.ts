import User from "@/models/user.model";
import { IUserDocument } from "@/types";
import { AppError } from "@/errors/app.error";
import { handleUserConflict, userExists } from "@/utils/user.utils";

// ============================================================================
// Create User
// ============================================================================

interface CreateUserData {
	email: string;
	username: string;
	password: string;
	firstName?: string;
	lastName?: string;
	gender?: string;
	birthDate?: string;
}

/**
 * Creates a new user if no conflict exists.
 */
async function createUser(data: CreateUserData): Promise<IUserDocument> {
	const result = await userExists({
		email: data.email,
		username: data.username,
	});

	if (result.exists) {
		const conflict = handleUserConflict(result.user, data);
		throw new AppError("Conflict", conflict.errorMessage, {
			...(conflict.username && { username: conflict.username }),
			...(conflict.email && { email: conflict.email }),
		});
	}

	const _birthDate = data.birthDate ? new Date(data.birthDate) : undefined;

	const user = await User.create({
		username: data.username.trim().toLowerCase(),
		email: data.email.trim().toLowerCase(),
		password: data.password,
		firstName: data.firstName,
		lastName: data.lastName,
		gender: data.gender,
		birthDate: _birthDate,
	});

	return user;
}

// ============================================================================
// Login User
// ============================================================================

interface LoginUserData {
	identifier: string;
	password: string;
}

/**
 * Authenticate user by username or email and validate account status
 */
async function loginUser(
	data: LoginUserData,
): Promise<{ user: IUserDocument; token: string }> {
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

	await user.updateLastLogin();

	return {
		user,
		token: user.generateAuthToken(),
	};
}

export { createUser, loginUser };
