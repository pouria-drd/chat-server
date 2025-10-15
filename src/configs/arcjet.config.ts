import ENV from "./env.config";
import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const ARCJET_KEY = ENV.ARCJET_KEY;

if (!ARCJET_KEY) {
	throw new Error(
		"ArcJet API key is required. Please set the ARCJET_KEY environment variable.",
	);
}

const aj = arcjet({
	key: ARCJET_KEY,
	rules: [
		// Shield protects your app from common attacks e.g. SQL injection
		shield({ mode: "LIVE" }),
		// Create a bot detection rule
		detectBot({
			mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
			// Block all bots except the following
			allow: [
				"CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
				// Uncomment to allow these other common bot categories
				// See the full list at https://arcjet.com/bot-list
				//"CATEGORY:MONITOR", // Uptime monitoring services
				//"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
			],
		}),
		// Create a sliding window rule
		slidingWindow({
			mode: "LIVE",
			max: ENV.ARCJET_MAX,
			interval: ENV.ARCJET_INTERVAL,
		}),
	],
});

export default aj;
