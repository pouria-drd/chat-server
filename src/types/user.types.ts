import { JwtPayload } from "jsonwebtoken";
import { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    username: string;
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    role: "admin" | "user";
    gender: "male" | "female" | "other";
    status: "active" | "inactive" | "banned" | "deleted";
    isVerified: boolean;
    avatar?: string;
    password: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;

    generateAuthToken(): string;
    updateLastLogin(): Promise<void>;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserDTO {
    id: Schema.Types.ObjectId;
    email: string;
    username: string;
    avatar?: string;
    lastName?: string;
    firstName?: string;
    role: "admin" | "user";
    gender: "male" | "female" | "other";
    status: "active" | "inactive" | "banned" | "deleted";
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
}

export interface UserPayload {
    id: string;
    role: string;
    username: string;
}

export type RequestUser = JwtPayload & UserDTO;
export type CustomJwtPayload = JwtPayload & UserPayload;
