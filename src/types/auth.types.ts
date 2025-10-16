import { IUserDocument, UserDTO } from "./user.types";

/**
 * Create User Data — structure for creating a new user
 */
export interface CreateUserData {
	email: string;
	username: string;
	password: string;
	firstName?: string;
	lastName?: string;
	gender?: string;
	birthDate?: string;
	[key: string]: any; // allow additional optional fields
}

/**
 * Login User Data — structure for logging in an existing user
 */
export interface LoginUserData {
	identifier: string;
	password: string;
}

/**
 * Input structure for user existence check.
 */
export interface UserExistsQuery {
	username?: string;
	email?: string;
	identifier?: string;
}

export type UserExistsResponse =
	| { exists: false; user: null }
	| { exists: true; user: UserDTO; fullUser?: IUserDocument };

/**
 * Response structure for conflicts during registration.
 */
export interface ConflictResponse {
	email?: string;
	username?: string;
	errorMessage: string;
}
