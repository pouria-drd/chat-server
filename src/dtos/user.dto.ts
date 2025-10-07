import { IUser, UserDTO } from "@/types/user.type";

export const userDto = (user: IUser): UserDTO => {
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
