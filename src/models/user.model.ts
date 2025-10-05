import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ENV from "@/config/env";
import mongoose, { Document, Schema } from "mongoose";

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

    updateLastLogin(): void;
    generateAuthToken(): string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
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
            validate: {
                validator: (value: Date) => value <= new Date(),
                message: "Birth date cannot be in the future",
            },
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
            validate: {
                validator: (value: string) =>
                    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(value),
                message: "Avatar must be a valid image URL",
            },
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
                validator: (value: string) =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                        value
                    ),
                message:
                    "Password must include uppercase, lowercase, number, and special character",
            },
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
UserSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function () {
    const payload = {
        id: this._id,
        role: this.role,
        username: this.username,
    };

    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRES_IN || "1d",
    });
};

UserSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
