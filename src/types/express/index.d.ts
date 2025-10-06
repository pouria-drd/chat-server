import "express";
import { RequestUser } from "@/types/user.types";

declare module "express-serve-static-core" {
    interface Request {
        user?: RequestUser;
    }
}
