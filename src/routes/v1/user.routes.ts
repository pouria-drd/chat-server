import { Router } from "express";
import protect from "@/middlewares/auth.middleware";
import getAuthUser from "@/controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", protect, getAuthUser);

export default userRouter;
