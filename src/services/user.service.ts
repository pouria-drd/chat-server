import User from "@/models/user.model";
import { AppError } from "@/errors/app.error";

export const createUser = async (data: any) => {
    const existing = await User.findOne({
        $or: [{ username: data.username }, { email: data.email }],
    });
    if (existing) {
        throw new AppError("Conflict", "User already exists");
    }

    const user = await User.create(data);
    return user;
};
