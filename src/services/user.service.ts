import User from "@/models/user.model";
import { AppError } from "@/errors/app.error";

interface CreateUserData {
    username: string;
    email: string;
    password: string;
    [key: string]: any; // allow additional optional fields
}

export const createUser = async (data: CreateUserData) => {
    const existing = await User.findOne({
        $or: [{ username: data.username }, { email: data.email }],
    });
    if (existing) {
        // Determine the appropriate error message based on the existing user
        let errorMessage: string;
        if (existing.username === data.username && existing.email === data.email) {
            errorMessage = "A user with those credentials already exists";
        } else if (existing.username === data.username) {
            errorMessage = "A user with that username already exists";
        } else if (existing.email === data.email) {
            errorMessage = "A user with that email already exists";
        }
    }

    const user = await User.create(data);
    return user;
};
