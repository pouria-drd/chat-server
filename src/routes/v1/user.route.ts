import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware";
import { uploadAvatar } from "@/middlewares/upload.middleware";
import asyncHandler from "@/middlewares/asyncHandler.middleware";
import { getUser, uploadUserAvatar } from "@/controllers/user.controller";

const userRouter = Router();

/**
 * @route GET /api/v1/users/me
 * @desc Get user data for the authenticated user
 * @access Private
 */
userRouter.get("/me", protect, asyncHandler(getUser));

/**
 * @route POST /api/v1/users/avatar
 * @desc Upload or update user avatar
 * @access Private
 */
userRouter.post("/avatar", protect, uploadAvatar, asyncHandler(uploadUserAvatar));

export default userRouter;
