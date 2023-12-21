"use client";
import Image from "next/image";
import Link from "next/link";
// import FriendList from './chat/components/FriendList'
import FriendList from "./components/FriendList";
import ChatSection from "./components/ChatSection";
import ProfileInfos from "./components/ProfileInfos";
import { StaticImageData } from "next/image";
// import avatar from '../../public/garou-kid.jpeg';
import avatar from "../../../public/garou-kid.jpeg";
import ChannelPic from "../../../public/group_pic.jpg";
import jake from "../../../public/jakeWithHeadPhones.jpg";
// import avatar from '../../../public/garou-kid.jpeg';
// import ChannelPic from '../../../public/group_pic.jpg';
// import jake from '../../../public/jakeWithHeadPhones.jpg';
import { createContext, useEffect, useState } from "react";
import ConversationList, {
  ChatToggel,
  Conversations,
} from "./components/ConversationList";
import { ChatPage, ConversationInfo } from "./components/ConversationInfo";
// import { CONVERSATION_TYP } from "../../../../../backend_service/backend/types/chatTypes";

// import Message from './Message'

export interface Channel {
  id: number;
  channelName: string;
  channelPic: StaticImageData;
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

export const UserContext = createContext<User | null>(null);

export default function Home() {
  // const [friendSearch, setFriendSearch] = useState<Friend[]>(friendsData);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/" + "auth/check", {
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
  }, []);
  console.log("user data: ",user);
  if (!user) {
    return <div>not authorized</div>;
  }
  
  return (
    <>
      <UserContext.Provider value={user}>
        <ChatPage />
      </UserContext.Provider>
      {/* <ChatPage /> */}
    </>
    // <main className="main flex justify-center items-center h-full w-full ">
    //   <div className="h-full basis-1/4 flex">
    //     <Conversations>{/* <ConversationList /> */}</Conversations>
    //   </div>
    //   <div className="chatNprofile h-full basis-3/4 flex gap-9 px-12 py-24">
    //     <ChatSection />
    //     {/* <ProfileInfos /> */}
    //     <ConversationInfo type="D"></ConversationInfo>
    //   </div>
    // </main>
  );
}
