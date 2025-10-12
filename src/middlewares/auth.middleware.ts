import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import ENV from "@/configs/env.config";
import User from "@/models/user.model";
import { AppError } from "@/errors/app.error";
import { CustomJwtPayload, RequestUser, UserRole } from "@/types";

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
        let token: string | undefined;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new AppError("Unauthorized", "Authorization header not found");
        }

        let decoded: CustomJwtPayload | null = null;

        // Verify JWT
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
        req.user = user.toJSON() as RequestUser;

        next();
    } catch (error) {
        next(error);
    }
}

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

export { protect, authorizeRoles };
