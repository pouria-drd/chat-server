import path from "path";
import fs from "fs/promises";
import logger from "@/configs/logger.config";

/**
 * Safely deletes a file from the local filesystem.
 * Handles relative and absolute paths automatically.
 * Does nothing if the file doesn't exist.
 *
 * @param filePath - The file path (can start with `/uploads/...` or be a full path)
 */
export async function deleteFile(filePath?: string): Promise<void> {
	if (!filePath) return;

	try {
		// Normalize leading slashes (e.g., "/uploads/avatars/abc.png" → "uploads/avatars/abc.png")
		const relativePath = filePath.replace(/^\/+/, "");

		// Build absolute path from project root
		const absolutePath = path.join(process.cwd(), relativePath);

		// Try to delete the file
		await fs.unlink(absolutePath);

		logger.info(`[file.utils] Deleted file: ${absolutePath}`);
	} catch (err: any) {
		// Ignore missing file (ENOENT), but log other errors
		if (err.code !== "ENOENT") {
			logger.error(
				`[file.utils] Failed to delete file: ${filePath}`,
				err,
			);
		}
	}
}
