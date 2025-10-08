import { Router } from "express";
import protect from "@/middlewares/auth.middleware";
import { getUserChats } from "@/controllers/chat.controller";
import asyncHandler from "@/middlewares/async-handler.middleware";

const chatRouter = Router();

chatRouter.get("/user-chats", protect, asyncHandler(getUserChats));

export default chatRouter;
