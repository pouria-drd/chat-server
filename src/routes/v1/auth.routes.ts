import { Router } from "express";
import { register, login } from "@/controllers/auth.controller";
import asyncHandler from "@/middlewares/async-handler.middleware";
import { loginSchema, registerSchema } from "@/schemas/user.schema";
import validateRequest from "@/middlewares/validate-request.middleware";

const authRouter = Router();

authRouter.post("/login", validateRequest(loginSchema), asyncHandler(login));
authRouter.post("/register", validateRequest(registerSchema), asyncHandler(register));

export default authRouter;
