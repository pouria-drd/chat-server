import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import messageRoutes from "./message.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/messages", messageRoutes);

export default router;
