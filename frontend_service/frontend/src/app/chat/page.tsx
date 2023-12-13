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

// import Message from './Message'

export interface Conversations {
  id: number;
  name: string;
  profilePic: StaticImageData;
}
export interface Channel {
  id: number;
  channelName: string;
  channelPic: StaticImageData;
}

export const friendsData: Conversations[] = [
  {
    id: 1,
    name: "Anas",
    profilePic: avatar,
  },
  {
    id: 2,
    name: "Abdo",
    profilePic: avatar,
  },
  {
    id: 3,
    name: "Aymane",
    profilePic: avatar,
  },
  {
    id: 4,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 5,
    name: "Oussama",
    profilePic: jake,
  },
  {
    id: 6,
    name: "Aymane",
    profilePic: avatar,
  },
  {
    id: 7,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 8,
    name: "Oussama",
    profilePic: jake,
  },
  {
    id: 9,
    name: "Aymane",
    profilePic: avatar,
  },
  {
    id: 10,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 11,
    name: "Oussama",
    profilePic: jake,
  },
  {
    id: 12,
    name: "Aymane",
    profilePic: avatar,
  },
  {
    id: 13,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 14,
    name: "Oussama",
    profilePic: jake,
  },
  {
    id: 15,
    name: "Aymane",
    profilePic: avatar,
  },
  {
    id: 16,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 17,
    name: "Oussama",
    profilePic: jake,
  },
  {
    id: 18,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 19,
    name: "Oussama",
    profilePic: jake,
  },
  {
    id: 20,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 21,
    name: "Oussama",
    profilePic: jake,
  },
  {
    id: 22,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 23,
    name: "Oussama",
    profilePic: jake,
  },
  {
    id: 24,
    name: "Snowa",
    profilePic: avatar,
  },
  {
    id: 25,
    name: "Oussama",
    profilePic: jake,
  },
];

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
  const [friendSearch, setFriendSearch] = useState<Friend[]>(friendsData);
  const [channelSearch, setChannelSearch] = useState<Channel[]>(channelsData);

  return (
    <main className="main flex justify-center items-center h-full w-full ">
      <div className="h-full basis-1/4 flex">
        <FriendList
          friendSearch={friendSearch}
          setFriendSearch={setFriendSearch}
          channelSearch={channelSearch}
          setChannelSearch={setChannelSearch}
        />
      </div>
      <div className="chatNprofile h-full basis-3/4 flex gap-9 px-12 py-24">
        <ChatSection />
        <ProfileInfos />
      </div>
    </main>
  );
}
