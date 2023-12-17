import { io } from "socket.io-client";

const URL = "http://backend:3001";

export const socket = io(URL);
