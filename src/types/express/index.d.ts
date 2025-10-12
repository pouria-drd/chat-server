import "express";
import { RequestUser } from "@/types";

declare module "express-serve-static-core" {
    interface Request {
        user?: RequestUser;
    }
}
