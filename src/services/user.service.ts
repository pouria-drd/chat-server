import User from "@/models/user.model";
import AppError from "@/errors/app.error";
import ErrorType from "@/errors/types.error";

const createUser = async (data: any) => {
    const existing = await User.findOne({
        $or: [{ username: data.username }, { email: data.email }],
    });
    if (existing) {
        throw new AppError(ErrorType.Conflict, "User already exists", 409);
    }

    const user = await User.create(data);
    return user;
};

export default createUser;
