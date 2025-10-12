import { Response } from "express";
import packageJson from "../../package.json";

/**
 * Get the current application version.
 * @returns The current application version.
 */
function getAppVersion(): string {
    return packageJson.version || "0.1.0";
}

/**
 * Send a response with a success message and optional data.
 * @param res - The response object.
 * @param status - The HTTP status code.
 * @param message - The success message.
 * @param data - Optional data to be sent with the response.
 */
function sendResponse(res: Response, status: number, message: string, data = {}) {
    res.status(status).json({ success: true, message, data });
}

export { getAppVersion, sendResponse };
