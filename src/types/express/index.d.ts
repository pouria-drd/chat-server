import "express";
import { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
    id: string;
    role: string;
    username: string;
}

declare module "express-serve-static-core" {
    interface Request {
        user?: CustomJwtPayload;
    }
}
