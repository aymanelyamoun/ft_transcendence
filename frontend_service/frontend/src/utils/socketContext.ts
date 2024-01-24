import { socket } from "@/socket";
import { createContext } from "react";

export const SocketContext = createContext<typeof socket>(socket);