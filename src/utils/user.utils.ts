import User from "@/models/user.model";
import toUserDTO from "@/dtos/user.dto";
import { IUserDocument, UserDTO } from "@/types";

/**
 * Input structure for user existence check.
 */
interface UserExistsQuery {
	username?: string;
	email?: string;
	identifier?: string;
}

type UserExistsResponse =
	| { exists: false; user: null }
	| { exists: true; user: UserDTO; fullUser?: IUserDocument };

/**
 * Check if a user exists by email, username, or identifier.
 * @param data - query parameters
 * @param includeFull - if true, returns full Mongoose document (including password)
 */
async function userExists(
	data: UserExistsQuery,
	includeFull = false,
): Promise<UserExistsResponse> {
	const query = data.identifier
		? { $or: [{ username: data.identifier }, { email: data.identifier }] }
		: { $or: [{ username: data.username }, { email: data.email }] };

	// Only call .select('+password') if includeFull is true
	let userDoc;
	if (includeFull) {
		userDoc = await User.findOne(query).select("+password");
	} else {
		userDoc = await User.findOne(query);
	}

	if (!userDoc) return { exists: false, user: null };

	const userDTO = toUserDTO(userDoc);

	return includeFull
		? { exists: true, user: userDTO, fullUser: userDoc }
		: { exists: true, user: userDTO };
}

/**
 * Response structure for conflicts during registration.
 */
export interface ConflictResponse {
	email?: string;
	username?: string;
	errorMessage: string;
}

/**
 * Detects user registration conflicts based on username/email overlap.
 */
function handleUserConflict(
	existingUser: UserDTO,
	data: { username: string; email: string },
): ConflictResponse {
	// Check if username and email overlap
	const both =
		existingUser.username === data.username &&
		existingUser.email === data.email;

	const emailOnly = existingUser.email === data.email;
	const usernameOnly = existingUser.username === data.username;

	if (both) {
		return {
			errorMessage: "A user with this username and email already exists.",
			username: "Username already exists",
			email: "Email already exists",
		};
	}

	if (usernameOnly) {
		return {
			errorMessage: "A user with that username already exists.",
			username: "Username already exists",
		};
	}

	if (emailOnly) {
		return {
			errorMessage: "A user with that email already exists.",
			email: "Email already exists",
		};
	}

	return { errorMessage: "A user with this data already exists." };
}

export { handleUserConflict, userExists };
