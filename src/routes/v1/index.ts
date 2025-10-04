import { Router } from "express";
import authRoutes from "./auth.routes";
// import userRoutes from "./user.routes";
// import messageRoutes from "./message.routes";

const router = Router();

router.use("/auth", authRoutes);
// router.use("users", userRoutes);
// router.use("messages", messageRoutes);

export default router;
