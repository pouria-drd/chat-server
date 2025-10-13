import { RequestUser } from "./user.types";

declare module "socket.io" {
    interface Socket {
        user?: RequestUser;
    }
}
