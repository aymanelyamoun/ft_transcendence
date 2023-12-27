'use client';
import React, { useEffect } from "react";

import { socket } from "../../../socket"

export default function Page() {
    useEffect(() => {
        socket.connect()
        console.log ("socket connecting");
        socket.on('gameInvite', (data) => {console.log('get a game invite from', data.username)});
        socket.on('gameInviteAccepted', (data) => {console.log('Game started between you and ', data.username)});
        document.addEventListener("keydown", (e) => {
            if (e.key === "i")
                socket.emit('inviteGame', {id: "a922c45e-3b28-4981-89a2-4383b8712cc5"})
            else if (e.key === "a"){
                socket.emit('acceptGameInvite', {senderId: "a9f58269-b674-4675-8651-422e17669fab"})
            }
        });
        return () => {
            socket.off('gameInvite')
            socket.off('gameInviteAccepted')
            document.removeEventListener("keydown", (e) => {});
            socket.disconnect()
            console.log ("socket disconnecting")
        }
    }, [])
    return (<div className="text-white">hello mate</div>)
}