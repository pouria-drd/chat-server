import "socket.io";
import { RequestUser } from "@/types";

declare module "socket.io" {
    interface Socket {
        user?: RequestUser;
    }
}
