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
import { useState } from "react";
import ConversationList, {
  ChatToggel,
  Conversations,
} from "./components/ConversationList";
import { ConversationInfo } from "./components/conversationInfo";
// import { CONVERSATION_TYP } from "../../../../../backend_service/backend/types/chatTypes";

// import Message from './Message'

export interface Channel {
  id: number;
  channelName: string;
  channelPic: StaticImageData;
}

export const channelsData: Channel[] = [
  {
    id: 1,
    channelName: "channel 1",
    channelPic: ChannelPic,
  },
  {
    id: 2,
    channelName: "channel 2",
    channelPic: ChannelPic,
  },
  {
    id: 3,
    channelName: "channel 3",
    channelPic: ChannelPic,
  },
  {
    id: 4,
    channelName: "channel 4",
    channelPic: ChannelPic,
  },
  {
    id: 5,
    channelName: "channel 5",
    channelPic: ChannelPic,
  },
  {
    id: 6,
    channelName: "channel 6",
    channelPic: ChannelPic,
  },
  {
    id: 7,
    channelName: "channel 7",
    channelPic: ChannelPic,
  },
  {
    id: 8,
    channelName: "channel 8",
    channelPic: ChannelPic,
  },
  {
    id: 9,
    channelName: "channel 9",
    channelPic: ChannelPic,
  },
  {
    id: 10,
    channelName: "channel 10",
    channelPic: ChannelPic,
  },
  {
    id: 11,
    channelName: "channel 11",
    channelPic: ChannelPic,
  },
  {
    id: 12,
    channelName: "channel 12",
    channelPic: ChannelPic,
  },
  {
    id: 13,
    channelName: "channel 13",
    channelPic: ChannelPic,
  },
  {
    id: 14,
    channelName: "channel 14",
    channelPic: ChannelPic,
  },
  {
    id: 15,
    channelName: "channel 15",
    channelPic: ChannelPic,
  },
  {
    id: 16,
    channelName: "channel 16",
    channelPic: ChannelPic,
  },
  {
    id: 17,
    channelName: "channel 17",
    channelPic: ChannelPic,
  },
  {
    id: 18,
    channelName: "channel 18",
    channelPic: ChannelPic,
  },
  {
    id: 19,
    channelName: "channel 19",
    channelPic: ChannelPic,
  },
  {
    id: 20,
    channelName: "channel 20",
    channelPic: ChannelPic,
  },
  {
    id: 21,
    channelName: "channel 21",
    channelPic: ChannelPic,
  },
  {
    id: 22,
    channelName: "channel 22",
    channelPic: ChannelPic,
  },
  {
    id: 23,
    channelName: "channel 23",
    channelPic: ChannelPic,
  },
  {
    id: 24,
    channelName: "channel 24",
    channelPic: ChannelPic,
  },
  {
    id: 25,
    channelName: "channel 25",
    channelPic: ChannelPic,
  },
];

export default function Home() {
  // const [friendSearch, setFriendSearch] = useState<Friend[]>(friendsData);
  const [channelSearch, setChannelSearch] = useState<Channel[]>(channelsData);

  return (
    <main className="main flex justify-center items-center h-full w-full ">
      <div className="h-full basis-1/4 flex">
        <Conversations>{/* <ConversationList /> */}</Conversations>
      </div>
      <div className="chatNprofile h-full basis-3/4 flex gap-9 px-12 py-24">
        <ChatSection />
        {/* <ProfileInfos /> */}
        <ConversationInfo type="DIRECT"></ConversationInfo>
      </div>
    </main>
  );
}
