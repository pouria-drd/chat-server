import { Request, Response, NextFunction } from "express";

/**
 * asyncHandler
 *
 * A higher-order middleware for Express that allows you
 * to write async route handlers without try/catch blocks.
 *
 * It automatically catches any errors thrown inside the async function
 * and passes them to the next error-handling middleware.
 *
 * @param fn An async function that accepts (req, res, next).
 * @returns An Express middleware function that handles errors automatically.
 *
 * @example
 * import asyncHandler from "@/middlewares/asyncHandler";
 *
 * app.get("/user/:id", asyncHandler(async (req, res) => {
 *     const user = await findUser(req.params.id);
 *     res.json(user);
 * }));
 */
const asyncHandler = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		// Execute the async function and catch any errors automatically
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

export default asyncHandler;
