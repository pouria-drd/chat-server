import path from "path";
import cors from "cors";
import helmet from "helmet";
import favicon from "serve-favicon";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";

import router from "@/routes";
import ENV from "./configs/env.config";
import { getAppVersion } from "@/utils/app.utils";
import ajProtect from "@/middlewares/arcjet.middleware";
import errorMiddleware from "@/middlewares/error.middleware";
import httpLogger from "@/middlewares/httpLogger.middleware";

const app: Application = express();

// ✅ Serve favicon before other middleware
app.use(favicon(path.join(process.cwd(), "public", "favicon.ico")));

/* -----------------------------------------------------------
 * 🛡️  Security Middleware
 * ----------------------------------------------------------- */

/**
 * Helmet helps secure Express apps by setting various HTTP headers.
 * It protects against well-known web vulnerabilities like:
 * - Cross-Site Scripting (XSS)
 * - Click jacking
 * - MIME type sniffing
 *
 * Options:
 * - `contentSecurityPolicy`: configure CSP (can be disabled if using inline scripts)
 * - `crossOriginEmbedderPolicy`: useful for media-heavy apps
 */
app.use(helmet());

/* -----------------------------------------------------------
 * ⚙️  Core Middleware
 * ----------------------------------------------------------- */

/**
 * Enable Cross-Origin Resource Sharing (CORS)
 * Allows frontend clients (from other domains) to access your API.
 *
 * Options:
 * - `origin`: specify allowed origins (string | string[] | RegExp)
 * - `credentials`: enable cookies/auth headers (true/false)
 * - `methods`: allowed HTTP methods (default: GET,HEAD,PUT,PATCH,POST,DELETE)
 */
app.use(
    cors({
        origin: ENV.CORS_ORIGIN,
        credentials: true,
    })
);

/**
 * Parse JSON request bodies
 * Converts incoming JSON payloads into `req.body`
 */
app.use(express.json({ limit: ENV.JSON_LIMIT }));

/**
 * Parse cookies from incoming requests
 * Cookies become available on `req.cookies`
 */
app.use(cookieParser());

/**
 * Parse URL-encoded form data
 * Used for traditional HTML form submissions
 *
 * Options:
 * - `extended: true` allows rich objects and arrays encoded with qs library
 * - `extended: false` uses Node’s built-in querystring parser
 */
app.use(express.urlencoded({ extended: false }));

/**
 * HTTP Request Logger Middleware
 * Logs each incoming request (method, path, response time, status)
 * Similar to Django’s dev request log.
 */
app.use(httpLogger);

/**
 * Serve static files (e.g., uploaded images)
 * Files are accessible under `/uploads` route
 */
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

/**
 * Protect routes with ArcJet
 */
app.use(ajProtect);

/* -----------------------------------------------------------
 * 🚏  Routes
 * ----------------------------------------------------------- */

/**
 * Mount all application routes under `/api`
 * Example: /api/auth, /api/users, /api/posts
 */
app.use("/api", router);

/**
 * Root route (health check / info endpoint)
 * Returns basic app info and version.
 */
app.get("/", (req: Request, res: Response) => {
    res.json({
        success: true,
        name: "Chat Server",
        version: getAppVersion(),
        message: "Welcome to the chat server!",
    });
});

/* -----------------------------------------------------------
 * ❌  Global Error Handler
 * ----------------------------------------------------------- */

/**
 * Handles all errors thrown from routes or middleware.
 * Must be the last middleware in the chain.
 */
app.use(errorMiddleware);

export default app;
