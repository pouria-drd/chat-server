import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import ENV from "@/configs/env.config";
import User from "@/models/user.model";
import { userDto } from "@/dtos/user.dto";
import { AppError } from "@/errors/app.error";
import { CustomJwtPayload } from "@/types/user.type";

const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new AppError("Unauthorized", "Authorization header not found");
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as CustomJwtPayload;
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            throw new AppError("Unauthorized", "Invalid token");
        }
        req.user = userDto(user);
        next();
    } catch (error) {
        throw new AppError("Unauthorized", "Invalid token");
    }
};

export default protect;
