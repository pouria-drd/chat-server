import { Router } from "express";
import protect from "@/middlewares/auth.middleware";
import asyncHandler from "@/middlewares/async-handler.middleware";
import { chatAuthMiddleware } from "@/middlewares/chat.middleware";
import { getChatMessages, getUserChats, sendMessage } from "@/controllers/chat.controller";

const chatRouter = Router();

chatRouter.get("/my-chats", protect, asyncHandler(getUserChats));
chatRouter.get("/:chatId", protect, chatAuthMiddleware, asyncHandler(getChatMessages));
chatRouter.post("/:chatId", protect, chatAuthMiddleware, asyncHandler(sendMessage));

export default chatRouter;
