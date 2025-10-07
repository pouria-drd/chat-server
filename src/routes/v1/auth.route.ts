import { Router } from "express";
import protect from "@/middlewares/auth.middleware";
import asyncHandler from "@/middlewares/async-handler.middleware";
import { loginSchema, registerSchema } from "@/schemas/user.schema";
import validateRequest from "@/middlewares/validate-request.middleware";
import { checkAuth, register, login } from "@/controllers/auth.controller";

const authRouter = Router();

/**
 * @route POST /api/auth/login
 * @desc Login user
 */
authRouter.post("/login", validateRequest(loginSchema), asyncHandler(login));

/**
 * @route POST /api/auth/register
 * @desc Register user
 */
authRouter.post("/register", validateRequest(registerSchema), asyncHandler(register));

/**
 * @route GET /api/auth/check-auth
 * @desc Check if user is authenticated
 */
authRouter.get("/check-auth", protect, asyncHandler(checkAuth));

export default authRouter;
