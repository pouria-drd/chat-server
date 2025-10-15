import { MulterError } from "multer";
import upload from "@/configs/multer.config";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to handle avatar uploads
 @param req - Express request object
 @param res - Express response object
 @param next - Express next function
 */
async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
	try {
		const uploader = upload.single("avatar");

		uploader(req, res, (err) => {
			if (err instanceof MulterError) {
				if (err.code === "LIMIT_FILE_SIZE")
					return res.status(400).json({
						success: false,
						message: "File too large",
						error: {
							type: "BadRequest",
							statusCode: 400,
							details: {
								file: "File too large",
								avatar: "File too large",
							},
						},
					});

				return res.status(400).json({
					success: false,
					message: "Avatar upload failed",
					error: {
						type: "BadRequest",
						statusCode: 400,
						details: {
							file: "Avatar upload failed",
							avatar: "Avatar upload failed",
						},
					},
				});
			} else if (err) {
				return res.status(500).json({
					success: false,
					message: "Avatar upload failed",
					error: {
						type: "Internal",
						statusCode: 400,
						details: {
							file: "Avatar upload failed",
							avatar: "Avatar upload failed",
						},
					},
				});
			}
			next();
		});
	} catch (error) {
		next(error);
	}
}

export { uploadAvatar };
