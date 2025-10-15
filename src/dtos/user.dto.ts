import { IUserDocument, RequestUser, UserDTO } from "@/types";

/**
 * Converts a user document to a UserDTO
 * @param user - User document
 * @returns UserDTO
 */
function toUserDTO(user: IUserDocument | RequestUser): UserDTO {
    return {
        id: user.id || user._id.toString(),

        email: user.email,
        username: user.username,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`,

        bio: user.bio,
        avatar: user.avatar,

        lastName: user.lastName,
        firstName: user.firstName,

        isOnline: user.isOnline,
        isVerified: user.isVerified,
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
}

export default toUserDTO;
