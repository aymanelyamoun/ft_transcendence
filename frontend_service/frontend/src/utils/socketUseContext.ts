import { socket } from "@/socket";
import { createContext } from "react";

export const SocketUseContext = createContext<typeof socket>(socket);