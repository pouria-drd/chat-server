import "express";
import { RequestUser } from "@/types/user.type";

declare module "express-serve-static-core" {
    interface Request {
        user?: RequestUser;
    }
}
