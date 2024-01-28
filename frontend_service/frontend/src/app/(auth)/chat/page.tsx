"use client";

import { StaticImageData } from "next/legacy/image";
import { createContext, useEffect, useRef, useState } from "react";
import {useRouter} from 'next/navigation'
import { ChatPage } from "./components/conversationInfo";
// import { ChatPage } from "./components/conversationInfo";
import './spinoza.css'
import { socket } from "../../../socket";
import { AlertMessage } from "./components/alertMessage";
import { UserContext } from "@/utils/createContext";
import { SocketContext } from "@/utils/socketContext";

export interface Channel {
  id: number;
  channelName: string;
  channelPic: StaticImageData;
}

export interface Friend {
  id: string;
  username: string;
  profilePic: string;
  title?: string;
  online: boolean;
}
interface User {
  id: string;
  email: string;
  username: string;
  profilePic?: string;
  hash: string;
  typeLog: string;
  isTwoFactorEnabled: Boolean;
  isConfirmed2Fa: Boolean;
}



export default function Home() {
  const router = useRouter();
  // const [friendSearch, setFriendSearch] = useState<Friend[]>(friendsData);
  const [user, setUser] = useState<User | null>(null);
  const [playPopUp, setplayPopUp] = useState<boolean>(false);
  const popUpTimeout = useRef<NodeJS.Timeout>(null!);
  const inviterData = useRef<User>(null!);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/check", {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    checkAuthentication();
    socket.connect();
    socket.on('gameInvite', (data : any) => {
      inviterData.current = data;
      setplayPopUp(true);
      popUpTimeout.current = setTimeout(() => {
        setplayPopUp(false);
      }, 10000);
      // console.log("A notification of an invtation of a game : ", inviterData.current);
    })
    socket.on('gameInviteAccepted', (data : any) => {
      // console.log("A GAME HAS BEEN ACCEPTED : ", data);
    })
    socket.on('redirect', (destination : any) => {
      router.push(destination)
      // console.log("redirecting to : ", destination);
    })
    return () => {
      socket.off('redirect')
      socket.off('gameInvite');
      socket.off('gameInviteAccepted');
      socket.disconnect();
    };
  }, []);
    // console.log("user data: ",user);
    if (!user) {
    return <div>not authorized</div>;
  }
  
  return (
    <>
      {/* <UserContext.Provider value={user} */}
        <SocketContext.Provider value={socket}>
            {playPopUp && (<AlertMessage onClick={() => setplayPopUp(false)} message={`${inviterData.current.username} Wanna Play With You \n Ps: The Notification Gonna Disappear After 10 Sec`} type="wannaPlay" id={`${inviterData.current.id}`}/>)}
           <ChatPage />
        </SocketContext.Provider>
      {/* </UserContext.Provider> */}
    </>
  );
}
