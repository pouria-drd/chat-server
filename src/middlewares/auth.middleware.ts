import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import User from "@/models/user.model";
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
        return res.status(401).json({ success: false, message: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "Invalid token",
            });
        }
        req.user = {
            id: decoded.id,
            role: decoded.role,
            username: decoded.username,
        };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default protect;
