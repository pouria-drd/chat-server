import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";

import router from "@/routes";
import errorMiddleware from "@/middlewares/error.middleware";

const app: Application = express();

// Security
app.use(helmet());

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the chat server!");
});

// Health check
app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "OK" });
});

// Error handler (last)
app.use(errorMiddleware);

export default app;
