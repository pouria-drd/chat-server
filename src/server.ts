import http from "http";
import app from "./app";
import chalk from "chalk";
import { ENV } from "./config/env";

const server = http.createServer(app);

// Socket.IO will hook into this `server` later
// import { setupSocket } from "./socket";
// setupSocket(server);

server.listen(ENV.PORT, () => {
    console.log(chalk.green.bold("======================================"));
    console.log(chalk.blue.bold("🚀 Server is running!"));
    console.log(chalk.cyan(`🌐 URL: http://localhost:${ENV.PORT}`));
    console.log(chalk.green.bold("======================================"));
});
