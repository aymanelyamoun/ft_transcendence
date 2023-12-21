import React, { use, useContext } from "react";
import { ConversationIthemProps } from "../../../../../../../backend_service/backend/types/chatTypes";
import { useState, useEffect, createContext } from "react";
import Image from "next/image";
import msg from "../../../../public/msg_icon.png";
import msgs from "../../../../public/msgs_icons.png";
import msg2 from "../../../../public/msg2_icon.png";
import msgs2 from "../../../../public/msgs2_icons.png";
import avatar from "../../../../../public/garou-kid.jpeg";
import splitBar from "../../../../../public/splitBar.png";

import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import { HiMiniChatBubbleLeft } from "react-icons/hi2";
import { Console } from "console";
// import SearchBar from "./SearchBar";
import {
  ButtonInfo,
  ConversationListContext,
  CostumeButton,
  LstConversationSetStateContext,
} from "./ConversationInfo";

export const IsChannelContext = createContext(false);

import { userId, isAdmin } from "./ConversationInfo";
import { AlertMessage } from "./AlertMessage";
import CreateChannel from "./CreateChannel";
import { FaRunning } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


const ConversationIthem = (props: ConversationIthemProps) => {
  const conversationProps = props;
  // const { id, name, profilePic, type, createdAt, channelId, lastMessage } =
  const setConversationList = useContext(LstConversationSetStateContext);
  props;

  const isChannel = useContext(IsChannelContext);
  const handleChatClick = () => {
    setConversationList(conversationProps);
  };
  return (
    <li
      onClick={handleChatClick}
      // key={props.id}
      className="friendsItem sm:w-full w-2/3 flex items-center gap-2 rounded-lg my-2 px-3 py-2 cursor-pointer"
    >
      <Image
        className=" w-[49px] h-[49px] rounded-full"
        src={avatar}
        // src={conversationProps.profilePic}
        // alt={conversationProps.name}
        alt={conversationProps.name}
      />
      <div className="flex flex-col">
        <p className="friendsName">{conversationProps.name}</p>
        <p className="text-xs font-thin w-[208.327px] truncate whitespace-nowrap overflow-hidden ">{"tmp message hi Your welcome message should ur welcome message should generally be succinct, fri ur welcome message should generally be succinct, frigur welcome message should generally be succinct, frienerally be succinct, friendly, and informative. It should clearly confirm and clarify what your subscriber signed up for, as well as provide instructions on how they can opt out."}</p>
      </div>
    </li>
  );
};

export const ConversationList = ({
  isChannel,
}: // rowData,
// conversation,
// setConversation,
{
  isChannel: boolean;
  // rowData: Conversation[];
  // conversation: ConversationIthemProps[];
  // setConversation: React.Dispatch<
  //   React.SetStateAction<ConversationIthemProps[]>
  // >;
}) => {
  const ConversationListData = useContext(ConversationListContext);
  if (!isChannel) {
    {
      return (
        <div className="friendsScroll overflow-y-auto overflow-x-hidden ">
          <ul className=" flex-col items-center w-full cursor-pointe relative h-full grid gap-y-2">
            {ConversationListData &&
              ConversationListData.map((conv) => {
                if (conv.type === "DIRECT") {
                  return (
                    <ConversationIthem
                      key={conv.id}
                      id={conv.id}
                      name={conv.name}
                      profilePic={conv.profilePic}
                      type={conv.type}
                      title={conv.title}
                      createdAt={conv.createdAt}
                      channelId={conv.channelId}
                      lastMessage={conv.lastMessage}
                    />
                  );
                }
              })}
          </ul>
        </div>
      );
    }
  }
  return (
    <div className="friendsScroll overflow-y-auto overflow-x-hidden ">
      <ul className=" flex-col items-center w-full cursor-pointe relative h-full grid gap-y-2">
        {ConversationListData &&
          ConversationListData.map((conv) => {
            if (conv.type === "CHANNEL_CHAT") {
              return (
                <ConversationIthem
                  key={conv.id}
                  id={conv.id}
                  name={conv.name}
                  profilePic={conv.profilePic}
                  type={conv.type}
                  title={conv.title}
                  createdAt={conv.createdAt}
                  channelId={conv.channelId}
                  lastMessage={conv.lastMessage}
                />
              );
            }
          })}
      </ul>
    </div>
  );
};

export const Conversations = ({
  // conversationList,
  // setConversationList,
  children,
}: {
  // conversationList: ConversationIthemProps[];
  // setConversationList: React.Dispatch<
  // React.SetStateAction<ConversationIthemProps[]>
  // >;
  children: React.ReactNode;
}) => {
  const [isChannel, setIsChannel] = useState<boolean>(false);
  // const [conversation, setConversation] = useState<ConversationIthemProps[]>(
  //   []
  // );

  // const userId = "010a3e90-75db-4df0-9cb1-bb6f8e9a5c60";
  // const isAdmin = "false";

  const [rowData, setRowData] = useState<ConversationIthemProps[]>([]);

  // useEffect(() => {
  //   const fetchFun = async () => {
  //     const res = await fetch(
  //       `http://localhost:3001/api/channels/getUserConversationsIthemList?userId=${userId}&isAdmin=${isAdmin}`,
  //       {
  //         method: "GET",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //       .then((res) => {
  //         return res.json();
  //         // const data: Conversation[];
  //       })
  //       .then((data) => {
  //         setRowData(data);
  //         setConversation(data);
  //       });
  //   };
  //   fetchFun();
  // }, []);

  return (
    <div className="friendList w-full mr-12 relative">
      <IsChannelContext.Provider value={isChannel}>
        <ChatToggel setIsChannel={setIsChannel} />
        {/* <SearchBar
          rowData={rowData}
          // conversation={conversationList}
          // setConversation={setConversationList}
          // friendSearch={friendSearch}
          // setFriendSearch={setFriendSearch}
          // channelSearch={channelSearch}
          // setChannelSearch={setChannelSearch}
        /> */}
        <ConversationList
          isChannel={isChannel}
          // conversationListData={conversationList}
          // rowData={rowData}
          // setConversation={setConversationList}
        />
        {/* {children} */}
      </IsChannelContext.Provider>
    </div>
  );
};

const ChatButton = ({
  onClick,
  children,
}: {
  onClick: any;
  children: React.ReactNode;
}) => {
  return (
    <>
      <button onClick={onClick}>
        {children}
        {/* <Image src={imgUrl} alt={imgAlt} width={width} height={hight} /> */}
      </button>
    </>
  );
};

export const ChatToggel = ({
  setIsChannel,
}: {
  setIsChannel: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isChannel = useContext(IsChannelContext);

  const handleChatClick = () => {
    setIsChannel(false);
  };

  const handleChannelClick = () => {
    setIsChannel(true);
  };

  return !isChannel ? (
    // add space-evenly using tailwindcss
    <div className="msgs flex justify-evenly">
      <ChatButton onClick={handleChatClick}>
        <HiMiniChatBubbleLeft size={22} />
      </ChatButton>

      <Image className="h-[20px] w-[1px]" src={splitBar} alt="splitBar"></Image>

      <ChatButton onClick={handleChannelClick}>
        <HiMiniChatBubbleLeftRight
          size={22}
          color={`rgba(154, 155, 211, 0.5)`}
        />
      </ChatButton>
    </div>
  ) : (
    <div className="msgs flex justify-evenly">
      <ChatButton onClick={handleChatClick}>
        <HiMiniChatBubbleLeft size={22} color={`rgba(154, 155, 211, 0.5)`} />
      </ChatButton>

      <Image className="h-[20px] w-[1px]" src={splitBar} alt="splitBar"></Image>

      <ChatButton onClick={handleChannelClick}>
        <HiMiniChatBubbleLeftRight size={22} />
      </ChatButton>
    </div>
  );
};

export default ConversationList;
