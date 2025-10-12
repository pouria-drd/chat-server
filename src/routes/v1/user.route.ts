import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware";
import { uploadAvatar } from "@/middlewares/upload.middleware";
import asyncHandler from "@/middlewares/asyncHandler.middleware";
import { uploadUserAvatar } from "@/controllers/user.controller";

const userRouter = Router();

/**
 * @route POST /api/v1/users/avatar
 * @desc Upload or update user avatar
 * @access Private
 */
userRouter.post("/avatar", protect, uploadAvatar, asyncHandler(uploadUserAvatar));

export default userRouter;
