/// <reference types="@types/express" />
/// <reference types="../types/express" />

import jwt from "jsonwebtoken";
import { ExtendedError, Socket } from "socket.io";
import { Request, Response, NextFunction } from "express";

import ENV from "@/configs/env.config";
import User from "@/models/user.model";
import { AppError } from "@/errors/app.error";
import { CustomJwtPayload, UserRole } from "@/types";

/**
 * Middleware for authentication and optional role authorization
 *
 * Usage:
 *  - protect() → any authenticated user
 *  - protect("admin") → only admin users
 *  - protect("admin", "moderator") → admin or moderator users
 */
async function protect(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // extract token from request headers
        let token: string | undefined;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new AppError("Unauthorized", "Authorization header not found");
        }

        // Verify JWT
        let decoded: CustomJwtPayload | null = null;
        try {
            decoded = jwt.verify(token, ENV.JWT_SECRET) as CustomJwtPayload;
        } catch (error) {
            throw new AppError("Unauthorized", "Invalid/expired token");
        }

        // Find user
        if (!decoded?.id) {
            throw new AppError("Unauthorized", "Invalid/expired token");
        }
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            throw new AppError("Unauthorized", "Invalid/expired token");
        }

        // Attach user to request
        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Socket.IO authentication middleware
 * Checks for a valid JWT token in the http-only cookie
 * and attaches the user info to the socket
 */
const protectSocket = async (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
        // Try extracting from Authorization header
        const authHeader = socket.handshake.headers.authorization;
        let token: string | undefined;

        if (authHeader?.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        // (Optional fallback) Try extracting from cookies if needed
        if (!token) {
            token = socket.handshake.headers.cookie
                ?.split("; ")
                .find((row) => row.startsWith("jwt="))
                ?.split("=")[1];
        }

        if (!token) {
            throw new AppError("Unauthorized", "Authorization header not found");
        }

        // Verify JWT
        let decoded: CustomJwtPayload | null = null;
        try {
            decoded = jwt.verify(token, ENV.JWT_SECRET) as CustomJwtPayload;
        } catch (error) {
            throw new AppError("Unauthorized", "Invalid/expired token");
        }

        // Find user
        if (!decoded?.id) {
            throw new AppError("Unauthorized", "Invalid/expired token");
        }
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            throw new AppError("Unauthorized", "Invalid/expired token");
        }

        // attach user info to socket
        socket.user = user;

        next();
    } catch (error: any) {
        next(
            new AppError("Unauthorized", "Invalid/expired token", {
                message: error.message,
            })
        );
    }
};
/**
 * Restrict access based on user roles.
 * Use after protect() middleware
 * @param roles - Allowed roles (e.g. ["admin", "moderator"])
 * @example
 * app.get("/admin-only-route", protect, authorizeRoles("admin"),async (req, res) => {
 *     // Only admins can access this route
 * }));
 */
async function authorizeRoles(...roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", "User not authenticated");
            }

            if (!roles.includes(req.user.role)) {
                throw new AppError("Forbidden", "You are not allowed to perform this action");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

export { authorizeRoles, protect, protectSocket };
