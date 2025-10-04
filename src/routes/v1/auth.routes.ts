import { Router } from "express";
import { register, login } from "@/controllers/auth.controller";
import asyncHandler from "@/middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "@/schemas/user.schema";
import validateRequest from "@/middlewares/validateRequest.middleware";

const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), asyncHandler(register));
authRouter.post("/login", validateRequest(loginSchema), asyncHandler(login));

export default authRouter;
