import { IUser } from "@/models/user.model";

const userDto = (user: IUser) => {
    return {
        id: user._id,
        email: user.email,
        username: user.username,
        lastName: user.lastName,
        firstName: user.firstName,
        gender: user.gender,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
    };
};

export default userDto;
