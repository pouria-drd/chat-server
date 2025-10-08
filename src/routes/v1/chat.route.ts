import { Router } from "express";
import protect from "@/middlewares/auth.middleware";
import asyncHandler from "@/middlewares/async-handler.middleware";
import { chatAuthMiddleware } from "@/middlewares/chat.middleware";
import { getChatMessages, getUserChats } from "@/controllers/chat.controller";

const chatRouter = Router();

chatRouter.get("/my-chats", protect, asyncHandler(getUserChats));
chatRouter.get("/:chatId", protect, chatAuthMiddleware, asyncHandler(getChatMessages));

export default chatRouter;
