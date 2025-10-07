import { Router } from "express";
import protect from "@/middlewares/auth.middleware";
import { getUsersChats } from "@/controllers/message.controller";
import asyncHandler from "@/middlewares/async-handler.middleware";

const messageRouter = Router();

messageRouter.get("/users", protect, asyncHandler(getUsersChats));

export default messageRouter;
