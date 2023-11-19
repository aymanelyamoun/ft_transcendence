import { Socket } from "socket.io"

export type ConnectedSocketInfo = {
    socket: Socket,
    usernameId: string,
    username: string,
    roomId?: string,
    roomName?: string
}