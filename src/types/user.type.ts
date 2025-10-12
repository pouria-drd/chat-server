import { JwtPayload } from "jsonwebtoken";
import { BaseDocument } from "./common.types";

export const UserGender = {
    male: "male",
    female: "female",
    other: "other",
} as const;

export type UserGender = (typeof UserGender)[keyof typeof UserGender];

export const UserRole = {
    user: "user",
    admin: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
    active: "active",
    inactive: "inactive",
    banned: "banned",
    deleted: "deleted",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

/**
 * IUserDocument interface — represents a user document in MongoDB
 */
export interface IUserDocument extends BaseDocument {
    email: string;
    username: string;
    fullName: string;
    password: string;

    bio: string;
    avatar: string;
    lastName: string;
    firstName: string;

    isOnline: boolean;
    isVerified: boolean;
    emailVerified: boolean;

    role: UserRole;
    gender: UserGender;
    status: UserStatus;

    birthDate: Date;

    lastSeen: Date;
    lastLogin: Date;

    updateLastSeen(): Promise<void>;
    updateLastLogin(): Promise<void>;

    generateAuthToken(): string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User — Data Transfer Object for returning user data to clients
 */
export interface User {
    id: string; // string type for frontend usage

    email: string;
    username: string;
    fullName: string;

    bio?: string;
    avatar?: string;
    lastName?: string;
    firstName: string;

    isOnline: boolean;
    isVerified: boolean;
    emailVerified: boolean;

    role: UserRole;
    gender: UserGender;
    status: UserStatus;

    birthDate?: Date;

    lastSeen?: Date;
    lastLogin?: Date;

    updatedAt: Date;
    createdAt: Date;
}

/**
 * UserPayload — structure for JWT payload
 */
export interface UserPayload {
    id: string;
    role: string;
    username: string;
}

/**
 * RequestUser — request user object (JWT + DTO)
 */
export type RequestUser = JwtPayload & User;

/**
 * CustomJwtPayload — JWT payload including user info
 */
export type CustomJwtPayload = JwtPayload & UserPayload;
