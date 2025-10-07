import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

import ENV from "@/configs/env.config";
import { IUser, UserGender, UserPayload, UserRole, UserStatus } from "@/types/user.type";

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            trim: true,
            unique: true,
            index: true, // ✅ performance
            lowercase: true,
            required: [true, "Email is required"],
            set: (v: string) => v.trim().toLowerCase(),
            minlength: [5, "Email must be at least 5 characters"],
            maxlength: [255, "Email cannot exceed 255 characters"],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        },
        phone: {
            type: String,
            trim: true,
            unique: true,
            sparse: true, // ✅ allows nulls without unique conflicts
            match: [/^\+?[0-9]{7,15}$/, "Please enter a valid phone number with country code"],
        },
        username: {
            type: String,
            trim: true,
            unique: true,
            index: true, // ✅ performance
            lowercase: true,
            required: [true, "Username is required"],
            set: (v: string) => v.trim().toLowerCase(),
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [20, "Username cannot exceed 20 characters"],
            match: [
                /^[a-z][a-z0-9_]{2,19}$/,
                "Username must start with a letter and contain only lowercase letters, numbers, or underscores",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            validate: {
                validator: (value: string) =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                        value
                    ),
                message:
                    "Password must include uppercase, lowercase, number, and special character",
            },
        },

        bio: {
            type: String,
            maxlength: [255, "Bio cannot exceed 255 characters"],
        },
        avatar: {
            type: String,
            validate: {
                validator: (value: string) =>
                    /^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$|^\/uploads\/.+\.(jpg|jpeg|png|gif|webp)$)/i.test(
                        value
                    ),
                message: "Avatar must be a valid image URL or local upload path",
            },
        },
        lastName: {
            type: String,
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },
        firstName: {
            type: String,
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name cannot exceed 50 characters"],
        },

        isOnline: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        phoneVerified: {
            type: Boolean,
            default: false,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        gender: {
            type: String,
            enum: Object.values(UserGender),
            default: UserGender.OTHER,
        },
        status: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.ACTIVE,
        },

        birthDate: {
            type: Date,
            validate: {
                validator: (value: Date) => value <= new Date(),
                message: "Birth date cannot be in the future",
            },
        },

        lastSeen: {
            type: Date,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Hash password before save
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords
UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function (): string {
    const payload: UserPayload = {
        id: this._id,
        role: this.role,
        username: this.username,
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRES_IN || "1d",
    });

    return token;
};

// Update last login
UserSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    await this.save();
};

// Update last seen
UserSchema.methods.updateLastSeen = async function () {
    this.lastSeen = new Date();
    await this.save();
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
