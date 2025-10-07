import packageJson from "../../package.json";

/**
 * Get the current application version.
 * @returns The current application version.
 */
export const getAppVersion = (): string => {
    return packageJson.version || "0.1.0";
};
