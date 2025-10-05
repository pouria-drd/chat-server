import ENV from "@/config/env";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import { AppError } from "@/errors/app.error";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    id: string;
    role: string;
    username: string;
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new AppError("Unauthorized", "Authorization header not found");
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new AppError("Unauthorized", "Invalid token");
        }
        req.user = {
            id: decoded.id,
            role: decoded.role,
            username: decoded.username,
        };
        next();
    } catch (error) {
        throw new AppError("Unauthorized", "Invalid token");
    }
};

export default protect;
