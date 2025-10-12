import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import chatRoutes from "./chat.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/chats", chatRoutes);

export default router;
