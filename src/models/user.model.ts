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
            index: true,
            unique: true,
            lowercase: true,
            required: [true, "Email is required"],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
        },
        username: {
            type: String,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
            required: [true, "Username is required"],
            minlength: [3, "Minimum 3 characters"],
            maxlength: [20, "Maximum 20 characters"],
            match: [/^[a-z][a-z0-9_]{2,19}$/, "Username must start with a letter"],
        },
        phone: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        password: {
            type: String,
            minlength: 8,
            select: false,
            required: true,
        },

        firstName: {
            type: String,
            trim: true,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: 255,
            default: "",
        },
        avatar: {
            type: String,
            default: "/uploads/avatars/default.png",
            validate: {
                validator: (value: string) =>
                    /^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$|^\/uploads\/.+\.(jpg|jpeg|png|gif|webp)$)/i.test(
                        value
                    ),
                message: "Avatar must be a valid image URL or local upload path",
            },
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
            index: true,
            default: UserRole.USER,
            enum: Object.values(UserRole),
        },
        gender: {
            type: String,
            default: UserGender.OTHER,
            enum: Object.values(UserGender),
        },
        status: {
            type: String,
            index: true,
            default: UserStatus.ACTIVE,
            enum: Object.values(UserStatus),
        },
        birthDate: {
            type: Date,
            default: null,
            validate: {
                validator: (v: Date) => v <= new Date(),
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
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform(_, ret: Record<string, any>) {
                ret.id = ret._id?.toString();
                delete ret._id;
                delete ret.password;
                return ret;
            },
        },
    }
);

// ✅ Hash password
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/**
 * Compare passwords
 */
UserSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

/**
 * Generate JWT token
 */
UserSchema.methods.generateAuthToken = function () {
    const payload: UserPayload = {
        id: this._id.toString(),
        role: this.role,
        username: this.username,
    };
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN || "1d" });
};

/**
 * Update last login
 */
UserSchema.methods.updateLastLogin = async function () {
    await this.updateOne({ lastLogin: new Date() });
};

/**
 * Update last seen
 */
UserSchema.methods.updateLastSeen = async function () {
    await this.updateOne({ lastSeen: new Date() });
};

UserSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName || ""}`.trim();
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
