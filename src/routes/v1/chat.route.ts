import { Router } from "express";
import protect from "@/middlewares/auth.middleware";
import asyncHandler from "@/middlewares/async-handler.middleware";
import { getChatMessages, getUserChats } from "@/controllers/chat.controller";

const chatRouter = Router();

chatRouter.get("/my-chats", protect, asyncHandler(getUserChats));
chatRouter.get("/:chatId", protect, asyncHandler(getChatMessages));

export default chatRouter;
