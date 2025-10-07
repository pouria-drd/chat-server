import { JwtPayload } from "jsonwebtoken";
import { Document, Schema } from "mongoose";

export enum UserGender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
}

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned",
    DELETED = "deleted",
}

/**
 * IUser interface — represents a user document in MongoDB
 */
export interface IUser extends Document {
    _id: Schema.Types.ObjectId; // Mongoose ObjectId

    email: string;
    phone?: string;
    username: string;
    password: string;

    bio?: string;
    avatar?: string;
    lastName?: string;
    firstName?: string;

    isOnline: boolean;
    isVerified: boolean;
    phoneVerified: boolean;
    emailVerified: boolean;

    role: UserRole;
    gender: UserGender;
    status: UserStatus;

    birthDate?: Date;

    lastSeen: Date;
    lastLogin?: Date;

    updatedAt: Date;
    createdAt: Date;

    updateLastSeen(): Promise<void>;
    updateLastLogin(): Promise<void>;

    generateAuthToken(): string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * UserDTO — Data Transfer Object for returning user data to clients
 */
export interface UserDTO {
    id: string; // string type for frontend usage

    email: string;
    phone?: string;
    username: string;

    bio?: string;
    avatar?: string;
    lastName?: string;
    firstName?: string;

    isOnline: boolean;
    isVerified: boolean;
    phoneVerified: boolean;
    emailVerified: boolean;

    role: UserRole;
    gender: UserGender;
    status: UserStatus;

    birthDate?: Date;

    lastSeen: Date;
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
export type RequestUser = JwtPayload & UserDTO;

/**
 * CustomJwtPayload — JWT payload including user info
 */
export type CustomJwtPayload = JwtPayload & UserPayload;
