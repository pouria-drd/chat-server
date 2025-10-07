import { IUser, UserDTO } from "@/types/user.type";

export const userDto = (user: IUser): UserDTO => {
    return {
        id: user._id.toString(),

        email: user.email,
        phone: user.phone,
        username: user.username,

        bio: user.bio,
        avatar: user.avatar,
        lastName: user.lastName,
        firstName: user.firstName,

        isOnline: user.isOnline,
        isVerified: user.isVerified,
        phoneVerified: user.phoneVerified,
        emailVerified: user.emailVerified,

        role: user.role,
        gender: user.gender,
        status: user.status,

        birthDate: user.birthDate,

        lastSeen: user.lastSeen,
        lastLogin: user.lastLogin,

        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
    };
};
