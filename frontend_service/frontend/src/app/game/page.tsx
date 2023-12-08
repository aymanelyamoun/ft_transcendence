// import socket io client
'use client';
import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import Cookies from 'js-cookie';



export default function GameDisplay() {


  const socketRef = useRef(io("http://localhost:3001/api/game", {auth:{token : Cookies.get("access_token")}}));
    useEffect(() => {
        console.log("cookies" , Cookies.get("access_token"));
        if (typeof window !== 'undefined') {
          console.log(document.cookie);
          socketRef.current.disconnect();
          return () => {
          };
        }
      }, []);
    return(
        <div>
            <h1>Game</h1>
        </div>
    )
}