import User from "@/models/user.model";
import { IUser } from "@/types/user.types";
import { AppError } from "@/errors/app.error";

interface CreateUserData {
    username: string;
    email: string;
    password: string;
    [key: string]: any; // allow additional optional fields
}

/**
 * Create a new user
 * @param data - User data
 * @returns Created user
 */
export const createUser = async (data: CreateUserData): Promise<IUser> => {
    // Check if user already exists with the same username or email
    const existing = await User.findOne({
        $or: [{ username: data.username }, { email: data.email }],
    });
    if (existing) {
        // Determine the appropriate error message based on the existing user
        let errorMessage: string;
        if (existing.username === data.username && existing.email === data.email) {
            errorMessage = "A user with this data already exists";
            throw new AppError("Conflict", errorMessage, {
                username: "Username already exists",
                email: "Email already exists",
            });
        } else if (existing.username === data.username) {
            errorMessage = "A user with that username already exists";
            throw new AppError("Conflict", errorMessage, {
                username: "Username already exists",
            });
        } else if (existing.email === data.email) {
            errorMessage = "A user with that email already exists";
            throw new AppError("Conflict", errorMessage, {
                email: "Email already exists",
            });
        }
    }
    // Create the new user and return it
    const user = await User.create(data);
    return user;
};
