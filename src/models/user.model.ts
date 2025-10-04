import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
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

    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: [true, "Username is required"],
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [20, "Username cannot exceed 20 characters"],
            match: [
                /^[a-z][a-z0-9_]{2,19}$/,
                "Username must start with a letter, contain only lowercase letters, numbers, or underscores, and be between 3 to 20 characters",
            ],
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: [true, "Email is required"],
            minlength: [5, "Email must be at least 5 characters"],
            maxlength: [255, "Email cannot exceed 255 characters"],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        },
        phone: {
            type: String,
            trim: true,
            unique: true,
            required: false,
            match: [/^\+?[0-9]{7,15}$/, "Please enter a valid phone number with country code"],
        },
        firstName: {
            type: String,
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name cannot exceed 50 characters"],
        },
        lastName: {
            type: String,
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },
        birthDate: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "other",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "banned", "deleted"],
            default: "active",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        avatar: {
            type: String,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            validate: {
                validator: function (value: string) {
                    // Strong password validation
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                        value
                    );
                },
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            },
        },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT auth token
UserSchema.methods.generateAuthToken = function (): string {
    const payload = {
        id: this._id,
        username: this.username,
        role: this.role,
    };

    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRES_IN || "1d",
    });
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
