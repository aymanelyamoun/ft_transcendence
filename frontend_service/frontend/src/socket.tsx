import { io } from "socket.io-client";

const URL = "http://localhost:3001/api/chat";
export const socket = io(URL, {
  withCredentials: true,
});
