import { Router } from "express";
import { register, login } from "@/controllers/auth.controller";
import asyncHandler from "@/middlewares/asyncHandler.middleware";
import validateRequest from "@/middlewares/validateRequest.middleware";
import { loginSchema, registerSchema } from "@/validations/auth.schema";

const authRouter = Router();

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 */
authRouter.post("/login", validateRequest(loginSchema), asyncHandler(login));

/**
 * @route POST /api/v1/auth/register
 * @desc Register user
 */
authRouter.post("/register", validateRequest(registerSchema), asyncHandler(register));

export default authRouter;
