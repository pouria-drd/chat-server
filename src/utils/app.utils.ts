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
function sendResponse(
	res: Response,
	status: number,
	message: string,
	data = {},
) {
	res.status(status).json({ success: true, message, data });
}

/**
 * Extract a cookie value from a cookie header.
 * @param cookieHeader - The cookie header string.
 * @param name - The name of the cookie to extract.
 * @returns The value of the cookie, or null if not found.
 */
function getCookieValue(
	cookieHeader: string | undefined,
	name: string,
): string | null {
	if (!cookieHeader) return null;

	const cookies = cookieHeader.split(";").map((c) => c.trim());
	for (const cookie of cookies) {
		const [key, value] = cookie.split("=");
		if (key === name) return value;
	}
	return null;
}

export { getCookieValue, getAppVersion, sendResponse };
