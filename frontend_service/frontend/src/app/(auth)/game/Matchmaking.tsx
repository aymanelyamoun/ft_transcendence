"use client";
import React, { useRef, useState } from "react";
import "./globals.css";
import { useRouter } from "next/navigation";
// import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

interface GameMenuProps {
  setGameState: React.Dispatch<React.SetStateAction<string>>;
  gameState: string;
}

const Matchmaking = ({ setGameState, gameState }: GameMenuProps) => {
  const router = useRouter();
  const [queueTimer, setQueueTimer] = useState<number>(-1);
  const [inQueue, setInQueue] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const INTERVAL = useRef<NodeJS.Timeout | null>(null);
  const joinQueue = () => {
    setQueueTimer(0);
    setInQueue(true);
    if (!socketRef.current) {
      console.log("socket is null, creating new socket");
      socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL+"chat", {
        withCredentials: true,
      });
      socketRef.current.emit("matchmaking");
    }
    INTERVAL.current = setInterval(() => {
      setQueueTimer((queueTimer) => queueTimer + 1);
    }, 1000);
    socketRef.current.on("CancelQueue", () => {
      console.log("Getting a Cancel Queue event from server");
      clearInterval(INTERVAL.current!);
      socketRef.current?.disconnect();
      socketRef.current?.off("CancelQueue");
      socketRef.current = null;
      setGameState("menu");
    });
    socketRef.current.on("redirect", (destination: string) => {
      clearInterval(INTERVAL.current!);
      socketRef.current?.disconnect();
      socketRef.current = null;
      router.push(destination);
    });
    console.log("joined matchmaking");
  };

  const cancelQueue = () => {
    clearInterval(INTERVAL.current!);
    socketRef.current?.emit("CancelQueue");
    socketRef.current?.disconnect();
    socketRef.current?.off("CancelQueue");
    socketRef.current = null;
    setQueueTimer(-1);
    setInQueue(false);
  };
  const goBack = () => {
    socketRef.current?.emit("CancelQueue");
    socketRef.current?.disconnect();
    socketRef.current = null;
    setQueueTimer(-1);
    setInQueue(false);
    setGameState("menu");
  };
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      {!inQueue ? (
        <button className="buttonStart " onClick={joinQueue}>
          Join game
        </button>
      ) : (
        <button className="buttonStart " onClick={cancelQueue}>
          Cancel
        </button>
      )}

      <h1 className="text-white">
        {queueTimer >= 0 ? "In Queue... " + queueTimer + " sec" : null}
      </h1>
      <button className="buttonStart" onClick={goBack}>
        Back to menu
      </button>
    </div>
  );
};

export default Matchmaking;
