"use client";
import React, { use, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import msg from "../../../../public/msg_icon.png";
import msgs2 from "../../../../public/msgs2_icons.png";
import splitBar from "../../../../public/splitBar.png";
import axios from "axios";
// import msg from "../../../../public/msg_icon.png";
// import msgs2 from "../../../../public/msgs2_icons.png";
// import splitBar from "../../../../public/splitBar.png";
import SearchBar from "./SearchBar";
import FriendsChat from "./FriendsChat";
import ChannelChat from "./ChannelChat";
// import { Friend, friendsData } from '../../../../app/(notRoot)/page';
import { Channel, channelsData } from "../page";
import { Conversation } from "../../../../../../../backend_service/backend/types/chatTypes";
// import {
//   Friend,
//   friendsData,
//   Channel,
//   channelsData,
// } from "../../../../app/(notRoot)/chat/page";
import { useState, useRef } from "react";
import { IoMdAddCircle } from "react-icons/io";
import AddNewChannel from "./AddNewChannel";
import CreateChannel from "./CreateChannel";

interface FriendListProps {
  // friendSearch: Friend[];
  // setFriendSearch: React.Dispatch<React.SetStateAction<Friend[]>>;
  channelSearch: Channel[];
  setChannelSearch: React.Dispatch<React.SetStateAction<Channel[]>>;
}

const FriendList = ({
  // friendSearch,
  // setFriendSearch,
  channelSearch,
  setChannelSearch,
}: FriendListProps) => {
  // fetching ...

  // const [activeChat, setActiveChat] = useState<'friend' | 'channel'>('friend');
  const activeChat = useRef<"friend" | "channel">("friend");
  const selectFriend = useRef<boolean>(false);
  const [channelChatIcon, setChannelChatIcon] =
    useState<StaticImageData>(msgs2);
  const [friendsChatIcon, setFriendsChatIcon] = useState<StaticImageData>(msg);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<[Conversation]>([]);
  const inOrOutSearch = useRef<HTMLDivElement>(null);

  const [goToCreateChannel, setGoToCreateChannel] = useState<boolean>(false);

  // const [update, setUpdate] = useState<boolean>(false); // should be changed using sockets lestening on notifictations // later to be added to useEffect

  const userId = "0e1d8b57-aef4-45e6-9cf8-b834b87d0788";
  const isAdmin = "false";
  useEffect(() => {
    console.log("fetching ...");

    // const f = async () => {
    // const res = await
    fetch(
      `http://localhost:3001/api/channels/getUserConversationsDirect?userId=${userId}&isAdmin=${isAdmin}`,
      {
        method: "GET",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      }
    )
      .then((res) => {
        return res.json();
        // const data: Conversation[];
      })
      .then((data) => {
        console.log(data);
        setSelectedFriends(data);
      });

  }, []);

  const handleFriendChatClick = () => {
    activeChat.current = "friend";

  };

  const handleChannelChatClick = () => {
    activeChat.current = "channel";
  };

  const handleAddChannelClick = () => {
    setShowAddChannel(true);
    console.log("add channel clicked: " + showAddChannel);
  };

  const handleSelectFriend = (friend: Friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(
        selectedFriends.filter(
          (selectedFriends) => selectedFriends.id !== friend.id
        )
      );
      return;
    }
    setSelectedFriends([...selectedFriends, friend]);
  };

  const iconStyle = {
    width: "50px",
    height: "50px",
    bottom: "9%",
    right: "0",
  };

  return (
    <>
      <div className="friendList w-full mr-12 relative">
        <div className="msgs flex ">
          <FriendsChat
            onClickFriendsChat={handleFriendChatClick}
            activeState={activeChat}
            setFriendsChatIcon={setFriendsChatIcon}
            friendsChatIcon={friendsChatIcon}
            setChannelChatIcon={setChannelChatIcon}
          />

          <Image
            className="flex h-[28px] w-[1px]"
            src={splitBar}
            alt="splitBar"
          ></Image>

          <ChannelChat
            onClickChannelsChat={handleChannelChatClick}
            activeState={activeChat}
            setChannelChatIcon={setChannelChatIcon}
            channelChatIcon={channelChatIcon}
            setFriendsChatIcon={setFriendsChatIcon}
          />
        </div>
        {/* <div> */}
          <SearchBar
            // friendSearch={friendSearch}
            // setFriendSearch={setFriendSearch}
            channelSearch={channelSearch}
            setChannelSearch={setChannelSearch}
          />
        {/* </div> */}

        <div className="friendsScroll overflow-y-auto overflow-x-hidden ">
          <ul className=" flex-col items-center w-full cursor-pointe relative h-full grid gap-y-2">
            {activeChat.current === "friend" &&
              selectedFriends.map((conversation) => (
                <li
                  key={conversation.id}
                  className="friendsItem sm:w-full w-2/3 flex items-center gap-2 rounded-lg my-2 px-3 py-2 cursor-pointer"
                >
                  <Image
                    className=" w-[49px] h-[49px] rounded-full"
                    // src={conversation.users.profilePic}
                    alt={
                      // get the other user's name
                      getOtherUser(conversation, userId)
                    }
                  />
                  <p className="friendsName">{getOtherUser(conversation, userId)}</p>
                </li>
              ))}
            {activeChat.current === "channel" &&
              channelSearch.map((channel) => (
                <>
                  <li
                    key={channel.id}
                    className="friendsItem sm:w-full w-2/3 flex items-center gap-2 rounded-lg my-2 px-3 py-2 cursor-pointer"
                  >
                    <Image
                      className=" w-[49px] h-[49px] rounded-full"
                      src={channel.channelPic}
                      alt={channel.channelName}
                    />
                    <p className="friendsName">{channel.channelName}</p>
                  </li>
                </>
              ))}
            {activeChat.current === "channel" ? (
              <div className=" sticky w-[50px] ml-auto bottom-[12.8px] cursor-pointer">
                <IoMdAddCircle
                  style={iconStyle}
                  onClick={handleAddChannelClick}
                />
              </div>
            ) : null}
            {showAddChannel && (
              <AddNewChannel
                setShowAddChannel={setShowAddChannel}
                setGoToCreateChannel={setGoToCreateChannel}
              />
            )}
            {goToCreateChannel && <CreateChannel />}
          </ul>
        </div>
      </div>
    </>
  );
};

function getOtherUser(conversation: any, userId: string) {

                conversation.users[0].username === userId
                  ? conversation.users[1].username
                  : conversation.users[0].username
}

export default FriendList;
