'use client';;
import React, { useEffect, useRef, useState } from "react";
import { GameMenu } from "./Menu";
import Matchmaking from "./Matchmaking";
import { SocketContext } from "@/utils/socketContext";
import { socket } from "../../../socket";
import { useRouter } from "next/navigation";
import { AlertMessage } from "../chat/components/alertMessage";
// import { AlertMessage } from "@/app/components/alertMessage";

interface GameMenuProps {
    setGameState: React.Dispatch<React.SetStateAction<string>>;
    gameState: string;
}
interface User {
  id: string;
  email: string;
  username: string;
  profilePic?: string;
  hash: string;
  typeLog: string;
  isTwoFactorEnabled: Boolean;
} // use the exported interface instead

export default function GameDisplay() {
    const [gameState, setGameState] = useState('menu');
    const router = useRouter();
    const [playPopUp, setplayPopUp] = useState<boolean>(false);
    const popUpTimeout = useRef<NodeJS.Timeout>(null!);
    const inviterData = useRef<User>(null!);
    useEffect(() => {
      socket.connect()
      socket.on('redirect', (destination : string) => {
        router.push(destination)
      })
      socket.on('gameInvite', (data : any) => {
        inviterData.current = data;
        setplayPopUp(true);
        popUpTimeout.current = setTimeout(() => {
          setplayPopUp(false);
        }, 10000);
      })
      return () => {
          socket.disconnect();
          socket.off('redirect')
          socket.off('gameInvite');
        }
    }, [router])
    
  return (
      <div>
        {gameState === 'menu' && <GameMenu  setGameState={setGameState} gameState={gameState}/>}
        {gameState === 'playing' && <Matchmaking  setGameState={setGameState} gameState={gameState}/>}
        {playPopUp && (<AlertMessage onClick={() => setplayPopUp(false)}
        message={`${inviterData.current.username} Wanna Play With You \n Ps: The Notification Gonna Disappear After 10 Sec`}
        type="wannaPlay" id={`${inviterData.current.id}`}/>)}
      </div>
    );
}