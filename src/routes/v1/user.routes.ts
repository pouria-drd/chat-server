import { Router } from "express";
import protect from "@/middlewares/auth.middleware";
import { uploadAvatar } from "@/middlewares/upload.middleware";
import {
    cloudinaryUpdateUserAvatar,
    getAuthUser,
    uploadUserAvatar,
} from "@/controllers/user.controller";

const userRouter = Router();

/**
 * @route GET /api/users/me
 * @desc Get authenticated user
 * @access Private
 */
userRouter.get("/me", protect, getAuthUser);

/**
 * @route POST /api/users/avatar
 * @desc Upload or update user avatar
 * @access Private
 */
userRouter.post("/avatar", protect, uploadAvatar, uploadUserAvatar);

/**
 * @route POST /api/users/cloudinary
 * @desc Upload or update user avatar via cloudinary
 * @access Private
 */
userRouter.post("/avatar/cloudinary", protect, cloudinaryUpdateUserAvatar);

export default userRouter;
